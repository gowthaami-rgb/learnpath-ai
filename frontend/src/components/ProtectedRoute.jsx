import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

export default function ProtectedRoute({ children }) {
  const { state, authLoading } = useApp()

  // Firebase is still resolving whether the visitor has an existing
  // session — wait rather than redirecting, or a refresh would briefly
  // bounce logged-in users to /login.
  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-500" size={32} />
      </div>
    )
  }

  if (!state.user) return <Navigate to="/login" replace />
  return children
}
