import { useStore } from '../store'
 
const FLAVOR = {
  blue: { border: 'border-blue-500',  badge: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300',    dot: 'bg-blue-500',  duration: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',   btn: 'bg-blue-600 hover:bg-blue-500' },
  gold: { border: 'border-amber-400', badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300', dot: 'bg-amber-400', duration: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400', btn: 'bg-amber-500 hover:bg-amber-400' },
  rose: { border: 'border-rose-500',  badge: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',    dot: 'bg-rose-500',  duration: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',   btn: 'bg-rose-600 hover:bg-rose-500' },
  teal: { border: 'border-teal-500',  badge: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300',    dot: 'bg-teal-500',  duration: 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400',   btn: 'bg-teal-600 hover:bg-teal-500' },
}
 
export default function GamesView() {
  const { games, activeGame } = useStore()
 
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">Game Library</h2>
        <p className="text-sm text-stone-400 mt-1">{games.length} activities ready to play</p>
      </div>
 
      {activeGame && (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/50">
          <span className="text-lg">🎮</span>
          <div>
            <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Now Playing</p>
            <p className="text-sm font-bold text-stone-800 dark:text-stone-200">{activeGame.title}</p>
          </div>
          <button
            onClick={() => useStore.getState().clearGame()}
            className="ml-auto text-xs text-stone-400 hover:text-red-500 transition-colors px-2 py-1 rounded"
          >
            ✕ End game
          </button>
        </div>
      )}
 
      <div className="grid sm:grid-cols-2 gap-3">
        {games.map((game, i) => (
          <GameCard key={game.id} game={game} index={i} isActive={activeGame?.id === game.id} />
        ))}
      </div>
    </div>
  )
}
 
function GameCard({ game, index, isActive }) {
  const { selectGame } = useStore()
  const f = FLAVOR[game.flavor] ?? FLAVOR.blue
 
  return (
    <div
      style={{ animationDelay: `${index * 50}ms` }}
      className={`card rounded-2xl border-l-4 ${f.border} p-5 flex flex-col gap-3 animate-fade-up ${
        isActive ? 'ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-stone-900' : ''
      }`}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${f.dot}`} />
          <h3 className="font-bold text-stone-800 dark:text-stone-100 leading-snug text-sm">{game.title}</h3>
        </div>
        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${f.duration}`}>
          {game.duration}m
        </span>
      </div>
 
      <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{game.description}</p>
 
      {/* Labels */}
      <div className="flex flex-wrap gap-1.5">
        {game.labels.map((l) => (
          <span key={l} className={`text-xs font-medium px-2 py-0.5 rounded-full ${f.badge}`}>{l}</span>
        ))}
      </div>
 
      {/* Play button */}
      <button
        onClick={() => selectGame(game)}
        className={`mt-1 w-full py-2 rounded-xl text-white text-xs font-bold transition-all ${
          isActive
            ? 'bg-teal-600 cursor-default opacity-80'
            : `${f.btn} active:scale-95`
        }`}
        disabled={isActive}
      >
        {isActive ? '▶ Now Playing' : '▶ Play Now'}
      </button>
    </div>
  )
}