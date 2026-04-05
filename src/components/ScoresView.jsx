import { useState } from 'react'
import { useStore } from '../store'
import { useCountUp } from '../hooks/useCountUp'
import Avatar from './Avatar'
 
export default function ScoresView() {
  const { scores, teams, activeGame, sendCheer, giveStar, addPoints, resetBoard, announceWinner, setView } = useStore()
  const tp = scores.teal.points
  const gp = scores.gold.points
  const total = tp + gp || 1
  const teamsFormed = teams.teal.length > 0 || teams.gold.length > 0
 
  return (
    <div className="space-y-4">
 
      {/* Active game banner */}
      {activeGame ? (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-sm">
          <span className="text-2xl">🎮</span>
          <div className="flex-1">
            <p className="text-xs opacity-70 uppercase tracking-widest font-semibold">Now Playing</p>
            <p className="font-bold text-lg leading-tight">{activeGame.title}</p>
          </div>
          <span className="text-xs opacity-70 bg-white/10 px-2.5 py-1 rounded-full">{activeGame.duration}m</span>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/8">
          <span className="text-xl">🎮</span>
          <p className="text-sm text-stone-500 dark:text-stone-400">No game selected —</p>
          <button
            onClick={() => setView('games')}
            className="text-sm text-teal-600 dark:text-teal-400 font-semibold hover:underline"
          >
            Pick one from Games →
          </button>
        </div>
      )}
 
      {/* No teams yet */}
      {!teamsFormed && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50">
          <span className="text-xl">⚡</span>
          <p className="text-sm text-amber-700 dark:text-amber-400">Teams not generated yet —</p>
          <button
            onClick={() => setView('members')}
            className="text-sm text-amber-700 dark:text-amber-400 font-semibold hover:underline"
          >
            Go to Members →
          </button>
        </div>
      )}
 
      {/* Leader banner */}
      <LeaderBanner scores={scores} />
 
      {/* Progress bars */}
      <div className="card p-5 space-y-3">
        <h2 className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">Point Distribution</h2>
        <ScoreBar label="🟢 Teal" value={tp} total={total} color="bg-teal-500" />
        <ScoreBar label="🟡 Gold" value={gp} total={total} color="bg-amber-400" />
      </div>
 
      {/* Team panels */}
      <div className="grid grid-cols-2 gap-3">
        <TeamScore
          team="teal" label="Teal Team" emoji="🟢"
          scores={scores.teal}
          members={teams.teal}
          onCheer={() => sendCheer('teal')}
          onStar={() => giveStar('teal')}
          onPoints={(n) => addPoints('teal', n)}
        />
        <TeamScore
          team="gold" label="Gold Team" emoji="🟡"
          scores={scores.gold}
          members={teams.gold}
          onCheer={() => sendCheer('gold')}
          onStar={() => giveStar('gold')}
          onPoints={(n) => addPoints('gold', n)}
        />
      </div>
 
      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={announceWinner}
          className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-semibold text-sm transition-all shadow-sm"
        >
          🏆 Announce Winner
        </button>
        <button
          onClick={resetBoard}
          className="px-5 py-3 rounded-xl border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-white/5 font-semibold text-sm transition-all"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  )
}
 
function LeaderBanner({ scores }) {
  const tp = scores.teal.points
  const gp = scores.gold.points
  const tied = tp === gp
  const isTealLeading = tp > gp
 
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-sm ${
      tied ? 'bg-gradient-to-br from-stone-700 to-stone-800' :
      isTealLeading ? 'bg-gradient-to-br from-teal-600 to-teal-700' :
                      'bg-gradient-to-br from-amber-500 to-orange-600'
    }`}>
      <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 90% 10%, white, transparent 50%)' }} />
      <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">Current Standing</p>
      <p className="font-display text-2xl font-bold">
        {tied ? "It's a tie! ⚖️" : `${isTealLeading ? '🟢 Teal' : '🟡 Gold'} Team is leading`}
      </p>
      <p className="text-sm mt-2 opacity-70">Teal {tp} pts <span className="mx-2 opacity-40">·</span> Gold {gp} pts</p>
    </div>
  )
}
 
function ScoreBar({ label, value, total, color }) {
  const pct = Math.round((value / total) * 100)
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-stone-600 dark:text-stone-400">{label}</span>
        <span className="tabular-nums font-bold text-stone-700 dark:text-stone-300">{value} pts <span className="font-normal text-stone-400">({pct}%)</span></span>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
 
function TeamScore({ team, label, emoji, scores, members, onCheer, onStar, onPoints }) {
  const [custom, setCustom] = useState('')
  const display = useCountUp(scores.points)
 
  const isTeal = team === 'teal'
  const border = isTeal ? 'border-teal-200 dark:border-teal-800/60'             : 'border-amber-200 dark:border-amber-800/60'
  const header = isTeal ? 'bg-teal-50 dark:bg-teal-950/40'                      : 'bg-amber-50 dark:bg-amber-950/40'
  const title  = isTeal ? 'text-teal-700 dark:text-teal-400'                    : 'text-amber-700 dark:text-amber-400'
  const btn    = isTeal ? 'bg-teal-600 hover:bg-teal-500 active:bg-teal-700'   : 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600'
 
  const handleAddPoints = () => {
    const n = parseInt(custom, 10)
    if (n > 0 && n <= 999) { onPoints(n); setCustom('') }
  }
 
  return (
    <div className={`rounded-2xl border-2 ${border} overflow-hidden`}>
      {/* Header */}
      <div className={`${header} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span>{emoji}</span>
          <h3 className={`font-bold text-sm ${title}`}>{label}</h3>
        </div>
        {members.length > 0 && (
          <span className="text-xs text-stone-400">{members.length} members</span>
        )}
      </div>
 
      {/* Team member avatars */}
      {members.length > 0 && (
        <div className="px-4 pt-3 flex flex-wrap gap-1.5">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-1" title={m.name}>
              <Avatar initials={m.initials} avatarKey={m.avatarKey} size="xs" />
            </div>
          ))}
        </div>
      )}
 
      <div className="p-4 space-y-3">
        {/* Points display */}
        <div className="text-center py-1">
          <div className="text-4xl font-bold font-display tabular-nums text-stone-800 dark:text-stone-100">{display}</div>
          <div className="text-xs text-stone-400 mt-0.5">points</div>
        </div>
 
        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-2">
          <MiniStat icon="📣" label="Cheers" value={scores.cheers} />
          <MiniStat icon="⭐" label="Stars"  value={scores.stars}  />
        </div>
 
        {/* Cheer / Star */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onCheer} className={`py-2 rounded-xl text-white text-xs font-semibold transition-all active:scale-95 ${btn}`}>📣 Cheer +1</button>
          <button onClick={onStar}  className={`py-2 rounded-xl text-white text-xs font-semibold transition-all active:scale-95 ${btn}`}>⭐ Star +3</button>
        </div>
 
        {/* Custom points */}
        <div className="flex gap-2">
          <input
            type="number" value={custom} min="1" max="999"
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPoints()}
            placeholder="+pts"
            aria-label={`Add points to ${label}`}
            className="w-16 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-white/5 px-3 py-1.5 text-xs text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={handleAddPoints}
            disabled={!custom || parseInt(custom, 10) <= 0}
            className={`flex-1 py-1.5 rounded-xl text-white text-xs font-semibold transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-95 ${btn}`}
          >
            Add Points
          </button>
        </div>
      </div>
    </div>
  )
}
 
function MiniStat({ icon, label, value }) {
  return (
    <div className="bg-stone-50 dark:bg-white/5 rounded-xl p-2.5 text-center">
      <div className="text-base">{icon}</div>
      <div className="text-lg font-bold font-display text-stone-700 dark:text-stone-200 tabular-nums">{value}</div>
      <div className="text-xs text-stone-400">{label}</div>
    </div>
  )
}