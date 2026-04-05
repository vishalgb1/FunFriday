import { useState, useRef } from 'react'
import { useStore } from '../store'
import Avatar from './Avatar'
 
const ROLE_KEYS = ['Admin', 'Host', 'Lead', 'Member', 'New']
 
export default function MembersView() {
  const { members, teams, roles, addMember, removeMember, generateTeams, updateMemberRole } = useStore()
  const [input, setInput]   = useState('')
  const inputRef            = useRef(null)
  const teamsFormed         = teams.teal.length > 0 || teams.gold.length > 0
 
  const handleAdd = () => {
    if (!input.trim()) return
    addMember(input)
    setInput('')
    inputRef.current?.focus()
  }
 
  return (
    <div className="space-y-4">
 
      {/* Add member */}
      <div className="card p-5">
        <label className="block text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-3">
          Add Crew Member
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Enter full name…"
            aria-label="New member name"
            maxLength={60}
            className="flex-1 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-white/5 px-4 py-2.5 text-sm text-stone-800 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-600 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
          <button
            onClick={handleAdd}
            disabled={!input.trim()}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 active:bg-teal-700 disabled:opacity-40 disabled:pointer-events-none text-white text-sm font-semibold transition-all shadow-sm"
          >
            Add
          </button>
        </div>
      </div>
 
      {/* Member list + generate */}
      <div className="card">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h2 className="font-semibold text-stone-800 dark:text-stone-200">Crew</h2>
            <p className="text-xs text-stone-400 mt-0.5">{members.length} member{members.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={generateTeams}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white text-xs font-semibold transition-all shadow-sm"
          >
            <span>⚡</span> Generate Teams
          </button>
        </div>
 
        <div className="px-3 pb-3">
          {members.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-3xl mb-2">👥</div>
              <p className="text-sm text-stone-400">No crew yet — add the first member above.</p>
            </div>
          ) : (
            <ul className="space-y-0.5" role="list">
              {members.map((m, i) => (
                <li
                  key={m.id}
                  style={{ animationDelay: `${i * 30}ms` }}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-white/5 transition-colors animate-fade-up"
                >
                  <Avatar initials={m.initials} avatarKey={m.avatarKey} ring />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-700 dark:text-stone-200 truncate">{m.name}</p>
                    {m.note && (
                      <p className="text-xs text-stone-400 truncate">{m.note}</p>
                    )}
                  </div>
                  <InlineRolePicker
                    member={m}
                    roles={roles}
                    onChange={(newRole) => updateMemberRole(m.id, newRole)}
                  />
                  <button
                    onClick={() => removeMember(m.id)}
                    aria-label={`Remove ${m.name}`}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 text-stone-300 hover:text-red-400 transition-all text-xs"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
 
      {/* Teams */}
      {teamsFormed && (
        <div className="grid grid-cols-2 gap-3">
          <TeamCard label="Teal Team" emoji="🟢" members={teams.teal} color="teal" />
          <TeamCard label="Gold Team" emoji="🟡" members={teams.gold} color="gold" />
        </div>
      )}
    </div>
  )
}
 
const ROLE_COLORS = {
  Admin:  { badge: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400', select: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60' },
  Host:   { badge: 'bg-teal-50   dark:bg-teal-950/60   text-teal-600   dark:text-teal-400',   select: 'text-teal-600   dark:text-teal-400   bg-teal-50   dark:bg-teal-950/60'   },
  Lead:   { badge: 'bg-blue-50   dark:bg-blue-950/60   text-blue-600   dark:text-blue-400',   select: 'text-blue-600   dark:text-blue-400   bg-blue-50   dark:bg-blue-950/60'   },
  Member: { badge: 'bg-stone-100 dark:bg-white/5       text-stone-500  dark:text-stone-400',  select: 'text-stone-600  dark:text-stone-300  bg-stone-100 dark:bg-white/5'       },
  New:    { badge: 'bg-green-50  dark:bg-green-950/60  text-green-600  dark:text-green-400',  select: 'text-green-600  dark:text-green-400  bg-green-50  dark:bg-green-950/60'  },
}
 
function InlineRolePicker({ member, roles, onChange }) {
  const s = ROLE_COLORS[member.role] ?? ROLE_COLORS.Member
  return (
    <select
      value={member.role}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      aria-label={`Role for ${member.name}`}
      title="Click to change role"
      className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 border-0 outline-none
        focus:ring-2 focus:ring-teal-500 cursor-pointer appearance-none text-center
        ${s.select}`}
    >
      {roles.map((r) => (
        <option key={r.key} value={r.key}>{r.emoji} {r.label}</option>
      ))}
    </select>
  )
}
 
function TeamCard({ label, emoji, members, color }) {
  const isTeal = color === 'teal'
  const border = isTeal ? 'border-teal-200 dark:border-teal-800/60'   : 'border-amber-200 dark:border-amber-800/60'
  const header = isTeal ? 'bg-teal-50 dark:bg-teal-950/40'           : 'bg-amber-50 dark:bg-amber-950/40'
  const title  = isTeal ? 'text-teal-700 dark:text-teal-400'          : 'text-amber-700 dark:text-amber-400'
 
  return (
    <div className={`rounded-2xl border-2 ${border} overflow-hidden`}>
      <div className={`${header} px-4 py-3 flex items-center gap-2`}>
        <span>{emoji}</span>
        <h3 className={`font-bold text-sm ${title}`}>{label}</h3>
        <span className="ml-auto text-xs text-stone-400">{members.length}</span>
      </div>
      <ul className="px-3 py-2 space-y-1.5">
        {members.map((m) => (
          <li key={m.id} className="flex items-center gap-2.5">
            <Avatar initials={m.initials} avatarKey={m.avatarKey} size="xs" />
            <span className="text-sm text-stone-600 dark:text-stone-400 truncate">{m.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}