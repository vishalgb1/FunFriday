// app\src\components\Avatar.jsx
 
const GRADIENTS = {
  a1: 'from-teal-400  to-cyan-600',
  a2: 'from-amber-400 to-orange-500',
  a3: 'from-rose-400  to-pink-600',
  a4: 'from-violet-500 to-indigo-600',
}
 
const RING = {
  a1: 'ring-teal-200  dark:ring-teal-800',
  a2: 'ring-amber-200 dark:ring-amber-800',
  a3: 'ring-rose-200  dark:ring-rose-800',
  a4: 'ring-violet-200 dark:ring-violet-800',
}
 
const SIZES = {
  xs:  'w-7  h-7  text-xs',
  sm:  'w-8  h-8  text-xs',
  md:  'w-10 h-10 text-sm',
  lg:  'w-12 h-12 text-sm font-bold',
}
 
export default function Avatar({ initials, avatarKey = 'a1', size = 'md', ring = false }) {
  const gradient  = GRADIENTS[avatarKey] ?? GRADIENTS.a1
  const ringClass = ring ? `ring-2 ${RING[avatarKey] ?? RING.a1}` : ''
  const sizeClass = SIZES[size] ?? SIZES.md
 
  return (
    <div
      className={`${sizeClass} ${ringClass} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold shrink-0 select-none shadow-sm`}
      aria-label={initials}
    >
      {initials}
    </div>
  )
}