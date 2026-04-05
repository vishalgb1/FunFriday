import { create } from 'zustand'
import { supabase, DEMO_MODE } from './supabase'
 
// ── Fisher-Yates shuffle ─────────────────────────────────────
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
 
// ── Demo seed data ────────────────────────────────────────────
const DEMO_MEMBERS = [
  { id: '1', name: 'Priya Shah',   initials: 'PS', role: 'Host',   note: 'HR Partner · Loves icebreakers',     avatarKey: 'a2' },
  { id: '2', name: 'Dev Khanna',   initials: 'DK', role: 'Lead',   note: 'Product · Quizzes & rapid rounds',    avatarKey: 'a1' },
  { id: '3', name: 'Aisha Thomas', initials: 'AT', role: 'Member', note: 'Tech · Fast-paced champion',          avatarKey: 'a4' },
  { id: '4', name: 'Meera Rao',    initials: 'MR', role: 'Member', note: 'Marketing · Great crowd energy',      avatarKey: 'a3' },
  { id: '5', name: 'Sam Rivera',   initials: 'SR', role: 'Lead',   note: 'Design · Team captain vibes',         avatarKey: 'a1' },
  { id: '6', name: 'Jess Park',    initials: 'JP', role: 'New',    note: 'First Friday! 🌱',                    avatarKey: 'a3' },
]
 
const DEMO_GAMES = [
  { id: 'g1', title: 'Rapid-Fire Trivia',        duration: 15, description: 'Fast questions, team points, and instant live-score excitement.',       flavor: 'blue', labels: ['Live score', 'Hybrid', 'Zero prep'] },
  { id: 'g2', title: 'Desk Scavenger Hunt',       duration: 20, description: 'People race to find funny items, complete clues, and win stars.',       flavor: 'gold', labels: ['Cheer-heavy', 'Office', 'Team play'] },
  { id: 'g3', title: 'Charades Clash',            duration: 25, description: 'Big laughs, quick rounds, and easy scoring for hosts.',                 flavor: 'rose', labels: ['Simple', 'Any team', 'High fun'] },
  { id: 'g4', title: 'Mystery Pitch Battle',      duration: 30, description: 'Create wild product ideas and let the crowd award cheers and stars.',   flavor: 'teal', labels: ['Creative', 'Stars', 'Presentation'] },
  { id: 'g5', title: 'Emoji Story Jam',           duration: 30, description: 'Teams build hilarious stories from random emoji prompts.',              flavor: 'blue', labels: ['Remote-friendly', 'Cheer mode', 'Light'] },
  { id: 'g6', title: 'Minute-to-Win Challenges',  duration: 35, description: 'Tiny silly challenges with fast points and crowd reactions.',           flavor: 'gold', labels: ['Stars', 'High energy', 'Best live'] },
]
 
const ROLES = [
  { key: 'Admin',  emoji: '⚙️',  label: 'Admin',  desc: 'Manages the session, resets the board, and configures the hub.' },
  { key: 'Host',   emoji: '🎤',  label: 'Host',   desc: 'Runs the Friday session, announces winners, and keeps energy high.' },
  { key: 'Lead',   emoji: '🧭',  label: 'Lead',   desc: 'Team captain — motivates their crew and tracks the score.' },
  { key: 'Member', emoji: '🙌',  label: 'Member', desc: 'Plays games, earns cheers and stars, and brings the fun.' },
  { key: 'New',    emoji: '🌱',  label: 'New',    desc: 'First time at Friday Hub — welcome to the crew!' },
]
 
const initScores = () => ({
  teal: { points: 0, cheers: 0, stars: 0 },
  gold: { points: 0, cheers: 0, stars: 0 },
})
 
// ── Map DB row (snake_case) → app shape (camelCase) ────────────
function dbToMember(row) {
  return {
    id:        row.id,
    name:      row.name,
    initials:  row.initials,
    role:      row.role,
    note:      row.note ?? '',
    avatarKey: row.avatar_key,
  }
}
 
// ── Zustand store ─────────────────────────────────────────────
export const useStore = create((set, get) => ({
  members:     DEMO_MODE ? DEMO_MEMBERS : [],
  teams:       { teal: [], gold: [] },
  scores:      initScores(),
  games:       DEMO_GAMES,
  roles:       ROLES,
  activeView:  'members',
  activeGame:  null,
  toast:       null,
  theme:       localStorage.getItem('ffhub-theme') || 'light',
  loading:     false,
  sessionId:   null,
  tealTeamId:  null,
  goldTeamId:  null,
 
  // ── Navigation ───────────────────────────────────────────────
  setView: (view) => set({ activeView: view }),
 
  // ── Theme ────────────────────────────────────────────────────
  setTheme: (theme) => {
    localStorage.setItem('ffhub-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    set({ theme })
  },
 
  toggleTheme: () => get().setTheme(get().theme === 'light' ? 'dark' : 'light'),
 
  // ── Toast ────────────────────────────────────────────────────
  showToast: (message, type = 'info') => {
    const id = Date.now()
    set({ toast: { id, message, type } })
    setTimeout(() => set((s) => (s.toast?.id === id ? { toast: null } : {})), 3500)
  },
 
  // ── Game selection ──────────────────────────────────────────
  selectGame: (game) => {
    set({ activeGame: game })
    get().setView('scores')
    get().showToast(`Now playing: ${game.title} 🎮`, 'success')
  },
 
  clearGame: () => set({ activeGame: null }),
 
  // ── Members ──────────────────────────────────────────────────
  addMember: (name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const words = trimmed.split(' ').filter(Boolean)
    const initials = words.map((w) => w[0].toUpperCase()).join('').slice(0, 2)
    const avatarKey = ['a1', 'a2', 'a3', 'a4'][Math.floor(Math.random() * 4)]
    const member = {
      id:       crypto.randomUUID(),
      name:     trimmed,
      initials,
      role:     'Member',
      note:     '',
      avatarKey,
    }
    set((s) => ({ members: [...s.members, member] }))
    if (!DEMO_MODE && supabase) {
      // DB column is snake_case — map before inserting
      supabase.from('members').insert({
        id:         member.id,
        name:       member.name,
        initials:   member.initials,
        role:       member.role,
        note:       member.note,
        avatar_key: member.avatarKey,
      }).then(({ error }) => {
        if (error) console.error('[Supabase] insert member failed:', error.message)
      })
    }
    get().showToast(`${trimmed} joined the crew 🎉`, 'success')
  },
 
  removeMember: (id) => {
    set((s) => ({ members: s.members.filter((m) => m.id !== id) }))
    if (!DEMO_MODE && supabase) {
      supabase.from('members').delete().eq('id', id)
        .then(({ error }) => {
          if (error) console.error('[Supabase] delete member failed:', error.message)
        })
    }
  },
 
  updateMemberRole: (id, role) => {
    set((s) => ({ members: s.members.map((m) => m.id === id ? { ...m, role } : m) }))
    if (!DEMO_MODE && supabase) {
      supabase.from('members').update({ role }).eq('id', id)
        .then(({ error }) => {
          if (error) console.error('[Supabase] update role failed:', error.message)
        })
    }
  },
 
  // ── Teams ────────────────────────────────────────────────────
  generateTeams: async () => {
    const { members } = get()
    if (members.length < 2) {
      get().showToast('Need at least 2 members to form teams', 'warning')
      return
    }
    const shuffled = shuffle(members)
    const mid = Math.ceil(shuffled.length / 2)
    const tealMembers = shuffled.slice(0, mid)
    const goldMembers = shuffled.slice(mid)
    set({
      teams:  { teal: tealMembers, gold: goldMembers },
      scores: initScores(),
      tealTeamId: null,
      goldTeamId: null,
    })
    get().showToast('Teams assigned — let the games begin! 🎯', 'success')
 
    if (!DEMO_MODE && supabase) {
      const sessionId  = crypto.randomUUID()
      const tealTeamId = crypto.randomUUID()
      const goldTeamId = crypto.randomUUID()
 
      const { error: sErr } = await supabase.from('sessions').insert({
        id: sessionId, name: 'Friday Session',
        date: new Date().toISOString().split('T')[0],
      })
      if (sErr) { console.error('[Supabase] create session failed:', sErr.message); return }
 
      await supabase.from('teams').insert([
        { id: tealTeamId, session_id: sessionId, name: 'Teal Team', color: 'teal' },
        { id: goldTeamId, session_id: sessionId, name: 'Gold Team', color: 'gold' },
      ])
 
      await supabase.from('scores').insert([
        { session_id: sessionId, team_id: tealTeamId, points: 0, cheers: 0, stars: 0 },
        { session_id: sessionId, team_id: goldTeamId, points: 0, cheers: 0, stars: 0 },
      ])
 
      set({ sessionId, tealTeamId, goldTeamId })
    }
  },
 
  // ── Scoring ──────────────────────────────────────────────────
  // ── Internal: sync one team's score to Supabase ────────────
  _syncScore: (team) => {
    const { scores, tealTeamId, goldTeamId } = get()
    if (DEMO_MODE || !supabase) return
    const teamId = team === 'teal' ? tealTeamId : goldTeamId
    if (!teamId) return
    supabase.from('scores')
      .update({ ...scores[team], updated_at: new Date().toISOString() })
      .eq('team_id', teamId)
      .then(({ error }) => {
        if (error) console.error('[Supabase] sync score failed:', error.message)
      })
  },
 
  sendCheer: (team) => {
    set((s) => ({
      scores: {
        ...s.scores,
        [team]: { ...s.scores[team], cheers: s.scores[team].cheers + 1, points: s.scores[team].points + 1 },
      },
    }))
    get()._syncScore(team)
    get().showToast(`Cheer for ${team === 'teal' ? '🟢 Teal' : '🟡 Gold'}!`, 'info')
  },
 
  giveStar: (team) => {
    set((s) => ({
      scores: {
        ...s.scores,
        [team]: { ...s.scores[team], stars: s.scores[team].stars + 1, points: s.scores[team].points + 3 },
      },
    }))
    get()._syncScore(team)
    get().showToast(`⭐ Star awarded to ${team === 'teal' ? '🟢 Teal' : '🟡 Gold'}!`, 'success')
  },
 
  addPoints: (team, n) => {
    set((s) => ({
      scores: {
        ...s.scores,
        [team]: { ...s.scores[team], points: s.scores[team].points + n },
      },
    }))
    get()._syncScore(team)
  },
 
  resetBoard: () => {
    set({ scores: initScores(), teams: { teal: [], gold: [] }, activeGame: null, sessionId: null, tealTeamId: null, goldTeamId: null })
    get().showToast('Board reset — fresh start! 🔄', 'warning')
  },
 
  announceWinner: () => {
    const { scores } = get()
    const tp = scores.teal.points
    const gp = scores.gold.points
    if (tp === gp) {
      get().showToast("🎉 It's a tie — both teams win!", 'success')
    } else {
      const winner = tp > gp ? '🟢 Teal Team' : '🟡 Gold Team'
      get().showToast(`🏆 ${winner} takes the crown!`, 'success')
    }
  },
 
  // ── Supabase ─────────────────────────────────────────────────
  loadMembers: async () => {
    if (DEMO_MODE || !supabase) return
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at')
    if (error) { console.error('[Supabase] load members failed:', error.message); return }
    if (data) set({ members: data.map(dbToMember) })
  },
 
  loadGames: async () => {
    if (DEMO_MODE || !supabase) return
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('active', true)
      .order('title')
    if (error) { console.error('[Supabase] load games failed:', error.message); return }
    if (data?.length) set({ games: data })
  },
 
}))