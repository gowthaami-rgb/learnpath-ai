import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    const id = ++idCounter
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 3500)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function Toast({ toast, onClose }) {
  const icons = { success: CheckCircle2, error: XCircle, info: Info }
  const Icon = icons[toast.type] || Info
  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-sky-500',
  }

  return (
    <div className="pointer-events-auto animate-fadeUp flex items-center gap-2.5 pl-4 pr-3 py-3 rounded-xl shadow-soft bg-white dark:bg-slate-800 border border-white/60 dark:border-slate-700/60 min-w-[240px] max-w-sm">
      <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${colors[toast.type]}`}>
        <Icon size={14} className="text-white" />
      </span>
      <span className="text-sm flex-1">{toast.message}</span>
      <button onClick={onClose} aria-label="Dismiss" className="text-muted dark:text-slate-400 hover:text-ink dark:hover:text-white shrink-0">
        <X size={14} />
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
