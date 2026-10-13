export default function Card({ children, className = '', tint, ...props }) {
  const tints = {
    skyblue: 'bg-skyblue/60 dark:bg-sky-950/40',
    mint: 'bg-mint/60 dark:bg-emerald-950/40',
    lavender: 'bg-lavender/60 dark:bg-purple-950/40',
  }
  return (
    <div
      className={`rounded-2xl shadow-soft p-6 border border-white/60 dark:border-slate-700/60 ${
        tint ? tints[tint] : 'bg-white dark:bg-slate-800'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
