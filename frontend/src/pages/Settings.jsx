import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Moon, Sun, Bell, LogOut, User, Trash2, AlertTriangle } from 'lucide-react'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Settings() {
  const { state, toggleTheme, logout, resetData } = useApp()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [notifs, setNotifs] = useState({ daily: true, weekly: true, tips: false })
  const [confirmingReset, setConfirmingReset] = useState(false)

  const toggleNotif = (key) => setNotifs((n) => ({ ...n, [key]: !n[key] }))

  const handleReset = async () => {
    await resetData()
    setConfirmingReset(false)
    showToast('Your data has been reset', 'info')
    navigate('/profile')
  }

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-14 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <h3 className="font-semibold flex items-center gap-2 mb-4"><User size={18} /> Profile</h3>
        <div className="space-y-2 text-sm">
          <Row label="Name" value={state.profile?.name || state.user?.name || '—'} />
          <Row label="Email" value={state.user?.email || '—'} />
          <Row label="School / College" value={state.profile?.school || '—'} />
          <Row label="Career goal" value={state.profile?.careerGoal || '—'} />
        </div>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/profile')}>Edit Profile</Button>
      </Card>

      <Card>
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          {state.theme === 'light' ? <Sun size={18} /> : <Moon size={18} />} Theme
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted dark:text-slate-300">Currently using {state.theme} mode</p>
          <Button variant="secondary" onClick={toggleTheme}>Switch to {state.theme === 'light' ? 'Dark' : 'Light'}</Button>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold flex items-center gap-2 mb-4"><Bell size={18} /> Notifications</h3>
        <div className="space-y-3">
          <Toggle label="Daily reminders" checked={notifs.daily} onChange={() => toggleNotif('daily')} />
          <Toggle label="Weekly progress summary" checked={notifs.weekly} onChange={() => toggleNotif('weekly')} />
          <Toggle label="Learning tips" checked={notifs.tips} onChange={() => toggleNotif('tips')} />
        </div>
      </Card>

      <Card className="border-red-200 dark:border-red-900">
        <h3 className="font-semibold flex items-center gap-2 mb-2 text-red-600 dark:text-red-400">
          <AlertTriangle size={18} /> Danger Zone
        </h3>
        <p className="text-sm text-muted dark:text-slate-300 mb-4">
          This permanently clears your profile, assessment results, roadmap, and progress. Your account itself stays intact — you'll just start fresh.
        </p>

        {!confirmingReset ? (
          <Button
            variant="outline"
            className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
            onClick={() => setConfirmingReset(true)}
          >
            <Trash2 size={16} /> Reset My Data
          </Button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-red-600 dark:text-red-400">Are you sure? This can't be undone.</span>
            <Button
              variant="primary"
              className="!bg-red-500 hover:!bg-red-600"
              onClick={handleReset}
            >
              Yes, reset everything
            </Button>
            <Button variant="outline" onClick={() => setConfirmingReset(false)}>Cancel</Button>
          </div>
        )}
      </Card>

      <Button
        variant="outline"
        className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
        onClick={async () => { await logout(); navigate('/') }}
      >
        <LogOut size={16} /> Log out
      </Button>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-muted dark:text-slate-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer text-sm">
      <span>{label}</span>
      <button
        type="button"
        onClick={onChange}
        className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-700'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </label>
  )
}
