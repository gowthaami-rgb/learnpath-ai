export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-sky-500 text-white hover:bg-sky-600 shadow-soft hover:shadow-lg hover:-translate-y-0.5',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-ink dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700',
    outline: 'border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800',
    mint: 'bg-emerald-400 text-emerald-950 hover:bg-emerald-500 shadow-soft',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
