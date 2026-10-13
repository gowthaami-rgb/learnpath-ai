import { useEffect, useState } from 'react'
import { Sparkles, Loader2, RefreshCw } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { api } from '../data/api.js'

function fallbackFocus(roadmap, weekConfidence) {
  const weeks = roadmap?.weeks || []
  // Prefer a week marked "revisit"; otherwise the first week
  const revisitWeek = weeks.find((w) => weekConfidence?.[w.week] === 'revisit')
  const target = revisitWeek || weeks[0]
  if (!target) {
    return { focus: 'Start your assessment to generate a roadmap.', reason: 'No roadmap yet.' }
  }
  const skill = target.skills?.[0] || target.title
  return {
    focus: `Spend today's session on: ${skill} (Week ${target.week})`,
    reason: revisitWeek ? 'You marked this week as needing a revisit.' : 'This is the next step in your roadmap.',
  }
}

export default function TodayFocus() {
  const { state } = useApp()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(false)

  const load = () => {
    setLoading(true)
    api
      .getTodayFocus({ roadmap: state.roadmap, profile: state.profile, weekConfidence: state.weekConfidence })
      .then((res) => {
        setData(res)
        setIsFallback(false)
      })
      .catch((err) => {
        console.warn('Falling back to local today-focus logic:', err.message)
        setData(fallbackFocus(state.roadmap, state.weekConfidence))
        setIsFallback(true)
      })
      .finally(() => setLoading(false))
  }

  useEffect(load, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="rounded-2xl shadow-soft p-6 border border-white/60 dark:border-slate-700/60 bg-gradient-to-br from-skyblue via-mint to-lavender dark:from-slate-800 dark:via-slate-800 dark:to-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted dark:text-slate-300">
          <Sparkles size={14} className="text-sky-600" /> Today's Focus
        </div>
        <button onClick={load} disabled={loading} aria-label="Refresh today's focus" className="text-muted dark:text-slate-300 hover:text-ink dark:hover:text-white">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 mt-3 text-sm text-muted dark:text-slate-300">
          <Loader2 size={14} className="animate-spin" /> Picking today's priority...
        </div>
      ) : (
        <>
          <p className="mt-2 font-semibold text-lg leading-snug">{data.focus}</p>
          <p className="mt-1 text-sm text-muted dark:text-slate-300">{data.reason}</p>
          {isFallback && (
            <p className="mt-3 text-[11px] text-amber-700 dark:text-amber-300">
              Connect the Flask backend + Gemini API key for a live daily pick.
            </p>
          )}
        </>
      )}
    </div>
  )
}