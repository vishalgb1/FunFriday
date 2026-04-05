import { useEffect } from 'react'
import { useStore } from './store'
import { DEMO_MODE } from './supabase'
import Topbar from './components/Topbar'
import Hero from './components/Hero'
import MembersView from './components/MembersView'
import ScoresView from './components/ScoresView'
import RolesView from './components/RolesView'
import GamesView from './components/GamesView'
import Toast from './components/Toast'
 
const VIEWS = {
  members: MembersView,
  scores:  ScoresView,
  roles:   RolesView,
  games:   GamesView,
}
 
export default function App() {
  const { activeView, loadGames, loadMembers } = useStore()
  const ActiveView = VIEWS[activeView] ?? MembersView
 
  useEffect(() => {
    loadMembers()
    loadGames()
  }, [loadMembers, loadGames])
 
  return (
    <div className="min-h-screen bg-[#f5f4f0] dark:bg-[#0e0d0b] text-stone-800 dark:text-stone-200 transition-colors duration-200">
      {DEMO_MODE && (
        <div className="bg-amber-50 dark:bg-amber-950/80 border-b border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 text-xs text-center py-2 px-4 font-medium">
          Demo mode — data is local only. Add Supabase credentials to{' '}
          <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 rounded">.env</code> to enable persistence.
        </div>
      )}
      <Topbar />
      <main className="max-w-4xl mx-auto px-5 pb-20">
        <Hero />
        <div key={activeView} className="animate-fade-up">
          <ActiveView />
        </div>
      </main>
      <Toast />
    </div>
  )
}