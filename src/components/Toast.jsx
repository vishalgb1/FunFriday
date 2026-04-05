import { useStore } from '../store'
 
const TYPES = {
  success: { bar: 'bg-emerald-500', icon: '✓', label: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' },
  warning: { bar: 'bg-amber-400',   icon: '!', label: 'bg-amber-50   dark:bg-amber-950   border-amber-200   dark:border-amber-800   text-amber-800   dark:text-amber-200'   },
  error:   { bar: 'bg-red-500',     icon: '✕', label: 'bg-red-50     dark:bg-red-950     border-red-200     dark:border-red-800     text-red-800     dark:text-red-200'       },
  info:    { bar: 'bg-blue-500',    icon: 'i', label: 'bg-blue-50    dark:bg-blue-950    border-blue-200    dark:border-blue-800    text-blue-800    dark:text-blue-200'     },
}
 
export default function Toast() {
  const { toast } = useStore()
  if (!toast) return null
 
  const t = TYPES[toast.type] ?? TYPES.info
 
  return (
    <div
      key={toast.id}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-xl animate-slide-in max-w-sm ${t.label}`}
    >
      <span className={`mt-0.5 w-5 h-5 rounded-full ${t.bar} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
        {t.icon}
      </span>
      <span className="text-sm font-medium leading-snug">{toast.message}</span>
    </div>
  )
}