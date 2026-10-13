import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Chrome, Loader2 } from 'lucide-react'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import { useApp } from '../context/AppContext.jsx'

function friendlyError(err) {
  const code = err?.code || ''
  if (code.includes('user-not-found') || code.includes('invalid-credential')) return 'No account found with that email and password.'
  if (code.includes('wrong-password')) return 'Incorrect password.'
  if (code.includes('too-many-requests')) return 'Too many attempts. Please wait a moment and try again.'
  if (code.includes('invalid-email')) return 'That email address looks invalid.'
  return err?.message || 'Something went wrong. Please try again.'
}

export default function Login() {
  const { signInEmail, signInGoogle, state, isFirebaseConfigured } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const goNext = () => navigate(state.profile ? '/dashboard' : '/profile')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await signInEmail(email, password)
      goNext()
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await signInGoogle()
      goNext()
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <Card className="w-full max-w-md animate-fadeUp">
        <h1 className="text-2xl font-bold text-center">Welcome back</h1>
        <p className="text-center text-sm text-muted dark:text-slate-300 mt-1">Log in to continue your learning path</p>

        {!isFirebaseConfigured && (
          <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 rounded-lg px-3 py-2 mt-4 text-center">
            Demo mode — Firebase isn't configured, so any email/password will sign you in locally.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Field icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} />
          <Field icon={Lock} type="password" placeholder="Password" value={password} onChange={setPassword} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-sky-600 hover:underline">Forgot password?</Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 size={16} className="animate-spin" />} Log In
          </Button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
          <span className="text-xs text-muted">OR</span>
          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
          <Chrome size={16} /> Continue with Google
        </Button>

        <p className="text-center text-sm text-muted dark:text-slate-300 mt-6">
          Don't have an account? <Link to="/signup" className="text-sky-600 font-medium hover:underline">Sign up</Link>
        </p>
      </Card>
    </div>
  )
}

function Field({ icon: Icon, type, placeholder, value, onChange }) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-sky-400 outline-none text-sm"
      />
    </div>
  )
}
