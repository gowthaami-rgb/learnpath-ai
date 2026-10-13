import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, CheckCircle2, Loader2 } from 'lucide-react'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import { useApp } from '../context/AppContext.jsx'

export default function ForgotPassword() {
  const { resetPassword, isFirebaseConfigured } = useApp()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      // Firebase intentionally doesn't reveal whether an email exists, but
      // network/invalid-format errors still surface here.
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <Card className="w-full max-w-md animate-fadeUp">
        {sent ? (
          <div className="text-center py-4">
            <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
            <h1 className="text-xl font-bold">Check your inbox</h1>
            <p className="text-sm text-muted dark:text-slate-300 mt-2">
              If an account exists for <strong>{email}</strong>, a password reset link is on its way.
            </p>
            <Link to="/login" className="inline-block mt-6 text-sky-600 font-medium hover:underline text-sm">Back to log in</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center">Reset your password</h1>
            <p className="text-center text-sm text-muted dark:text-slate-300 mt-1">
              Enter your email and we'll send you a reset link.
            </p>
            {!isFirebaseConfigured && (
              <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 rounded-lg px-3 py-2 mt-4 text-center">
                Demo mode — Firebase isn't configured, so no real email will be sent.
              </p>
            )}
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-sky-400 outline-none text-sm"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 size={16} className="animate-spin" />} Send Reset Link
              </Button>
            </form>
            <p className="text-center text-sm text-muted dark:text-slate-300 mt-6">
              Remembered it? <Link to="/login" className="text-sky-600 font-medium hover:underline">Log in</Link>
            </p>
          </>
        )}
      </Card>
    </div>
  )
}
