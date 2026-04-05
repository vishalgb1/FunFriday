import { useStore } from '../store'
 
const NAV = [
  { key: 'members', label: 'Members', icon: '👥' },
  { key: 'scores',  label: 'Scores',  icon: '🏆' },
  { key: 'roles',   label: 'Roles',   icon: '🎭' },
  { key: 'games',   label: 'Games',   icon: '🎮' },
]
 
export default function Topbar() {
  const { activeView, setView, theme, toggleTheme } = useStore()
 
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-[#0e0d0b]/90 border-b border-stone-200/80 dark:border-white/5">
      <div className="max-w-4xl mx-auto px-5 h-15 flex items-center gap-4">
 
        {/* Brand */}
        <div className="shrink-0 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-sm">🎉</div>
          <span className="font-display font-bold text-base text-stone-900 dark:text-stone-100 tracking-tight hidden sm:block">
            Freaky Friday Hub
          </span>
        </div>
 
        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-stone-200 dark:bg-stone-700" />
 
        {/* Nav */}
        <nav className="flex gap-0.5 flex-1 overflow-x-auto" aria-label="Main navigation">
          {NAV.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              aria-current={activeView === key ? 'page' : undefined}
              className={[
                'px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 focus-ring',
                activeView === key
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5',
              ].join(' ')}
            >
              <span className="mr-1.5">{icon}</span>{label}
            </button>
          ))}
        </nav>
 
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 text-stone-500 dark:text-stone-400 transition-colors focus-ring"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  )
}