import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Chrome, Loader2 } from 'lucide-react'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import { useApp } from '../context/AppContext.jsx'

function friendlyError(err) {
  const code = err?.code || ''
  if (code.includes('email-already-in-use')) return 'An account with that email already exists — try logging in instead.'
  if (code.includes('weak-password')) return 'Password is too weak. Use at least 6 characters.'
  if (code.includes('invalid-email')) return 'That email address looks invalid.'
  return err?.message || 'Something went wrong. Please try again.'
}

export default function Signup() {
  const { signUpEmail, signInGoogle, isFirebaseConfigured } = useApp()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await signUpEmail(name, email, password)
      navigate('/profile')
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
      navigate('/profile')
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <Card className="w-full max-w-md animate-fadeUp">
        <h1 className="text-2xl font-bold text-center">Create your account</h1>
        <p className="text-center text-sm text-muted dark:text-slate-300 mt-1">Start your personalized learning path in minutes</p>

        {!isFirebaseConfigured && (
          <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 rounded-lg px-3 py-2 mt-4 text-center">
            Demo mode — Firebase isn't configured, so this creates a local session only (not a real account).
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Field icon={User} type="text" placeholder="Full name" value={name} onChange={setName} />
          <Field icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} />
          <Field icon={Lock} type="password" placeholder="Password (min. 6 characters)" value={password} onChange={setPassword} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 size={16} className="animate-spin" />} Sign Up
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
          Already have an account? <Link to="/login" className="text-sky-600 font-medium hover:underline">Log in</Link>
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
