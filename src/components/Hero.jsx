import { useStore } from '../store'
import { useCountUp } from '../hooks/useCountUp'
import { DEMO_MODE } from '../supabase'
 
export default function Hero() {
  const { scores, members, teams } = useStore()
 
  const totalPoints = scores.teal.points + scores.gold.points
  const totalCheers = scores.teal.cheers + scores.gold.cheers
  const totalStars  = scores.teal.stars  + scores.gold.stars
  const teamsActive = teams.teal.length > 0 || teams.gold.length > 0
 
  return (
    <section className="py-8 pb-6">
      {/* Heading row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="live-dot w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              {DEMO_MODE ? 'Demo Mode' : 'Live'}
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl tracking-tight text-stone-900 dark:text-stone-50 leading-tight">
            Friday Session
          </h1>
          <p className="text-stone-400 dark:text-stone-500 text-sm mt-1">
            {members.length} crew member{members.length !== 1 ? 's' : ''}
            <span className="mx-2 opacity-40">·</span>
            {teamsActive
              ? <span className="text-teal-600 dark:text-teal-400 font-medium">2 teams active</span>
              : 'teams not yet generated'}
          </p>
        </div>
      </div>
 
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total Score" value={totalPoints} gradient="from-teal-500 to-teal-600"   icon="⚡" />
        <StatCard label="Cheers"      value={totalCheers} gradient="from-rose-500 to-pink-600"    icon="📣" />
        <StatCard label="Stars"       value={totalStars}  gradient="from-amber-400 to-orange-500" icon="⭐" />
      </div>
    </section>
  )
}
 
function StatCard({ label, value, gradient, icon }) {
  const display = useCountUp(value)

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-sm`}>
      <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 80% 20%, white, transparent 60%)' }} />
      <div className="text-2xl mb-3">{icon}</div>
      <div className="text-3xl font-bold font-display leading-none tabular-nums">{display}</div>
      <div className="text-xs font-medium mt-2 opacity-80 uppercase tracking-wider">{label}</div>
    </div>
  )
}