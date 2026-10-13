import { useEffect, useState } from 'react'
import { Clock, BarChart2, Loader2, ExternalLink, RefreshCw, Lightbulb, Search, X, UserCircle } from 'lucide-react'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { api } from '../data/api.js'
import { recommendedCourses as fallbackCourses } from '../data/mockData.js'

const tints = ['skyblue', 'mint', 'lavender']

export default function Courses() {
  const { state } = useApp()
  const { showToast } = useToast()
  const [courses, setCourses] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [freeOnly, setFreeOnly] = useState(false)
  const [query, setQuery] = useState('')

  const load = (freeOnlyOverride, silent) => {
    const wantFreeOnly = freeOnlyOverride ?? freeOnly
    setLoading(true)
    setError('')
    api
      .getCourses({ profile: state.profile, freeOnly: wantFreeOnly })
      .then((data) => {
        if (!Array.isArray(data.courses) || data.courses.length === 0) {
          throw new Error('Malformed response from /api/courses')
        }
        setCourses(data.courses)
        if (!silent) showToast('Courses refreshed', 'success')
      })
      .catch((err) => {
        console.warn('Falling back to sample courses:', err.message)
        setError('Using sample courses — connect the Flask backend + Gemini API key for picks tailored to your profile.')
        const fallback = wantFreeOnly ? fallbackCourses.filter((c) => c.free) : fallbackCourses
        setCourses(fallback)
        if (!silent) showToast('Could not reach the AI backend — showing sample courses', 'error')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => load(undefined, true), []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleFreeOnly = () => {
    const next = !freeOnly
    setFreeOnly(next)
    load(next)
  }

  const courseSearchUrl = (course) => {
    const searchQ = encodeURIComponent(course.searchQuery || `${course.name} ${course.platform}`)
    return `https://www.google.com/search?q=${searchQ}`
  }

  const allCourses = courses || fallbackCourses
  const visibleCourses = query.trim()
    ? allCourses.filter((c) =>
        `${c.name} ${c.platform} ${c.difficulty}`.toLowerCase().includes(query.trim().toLowerCase())
      )
    : allCourses

  if (!state.profile) {
    return (
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <EmptyState
          icon={UserCircle}
          title="Complete your profile for tailored courses"
          body="Course recommendations are matched to your career goal and current skills — set those up first."
          ctaLabel="Complete Your Profile"
          ctaTo="/profile"
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Recommended Courses</h1>
          <p className="text-muted dark:text-slate-300 mt-2">
            {state.profile?.careerGoal
              ? <>Curated for <strong>{state.profile.careerGoal}</strong>, based on your profile.</>
              : 'Curated to match your roadmap and current skill level.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted dark:text-slate-300 cursor-pointer select-none">
            Free only
            <button
              type="button"
              onClick={toggleFreeOnly}
              aria-pressed={freeOnly}
              className={`w-10 h-6 rounded-full transition-colors relative ${freeOnly ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${freeOnly ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </label>
          <Button variant="outline" onClick={() => load()} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 rounded-lg px-4 py-2 mt-4">
          {error}
        </p>
      )}

      <div className="relative mt-5 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, platform, or difficulty..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-sky-400 outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink dark:hover:text-white"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-24">
          <Loader2 className="animate-spin mx-auto text-sky-500" size={32} />
          <p className="mt-4 text-muted dark:text-slate-300">Finding courses for you...</p>
        </div>
      ) : visibleCourses.length === 0 ? (
        <p className="text-sm text-muted dark:text-slate-300 mt-10 text-center">
          No courses match "{query}". Try a different search.
        </p>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCourses.map((c, i) => (
            <Card key={c.name || i} tint={tints[i % 3]} className="flex flex-col animate-fadeUp" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-snug">{c.name}</h3>
                {c.free && (
                  <span className="shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-400 text-emerald-950">
                    FREE
                  </span>
                )}
              </div>
              <p className="text-sm text-muted dark:text-slate-300 mt-1">{c.platform}</p>
              <div className="flex items-center gap-4 mt-4 text-xs text-muted dark:text-slate-300">
                <span className="flex items-center gap-1"><Clock size={13} /> {c.duration}</span>
                <span className="flex items-center gap-1"><BarChart2 size={13} /> {c.difficulty}</span>
              </div>
              {c.reason && (
                <div className="mt-3 flex items-start gap-2 text-xs bg-white/60 dark:bg-slate-900/40 rounded-lg px-3 py-2">
                  <Lightbulb size={13} className="mt-0.5 shrink-0 text-amber-500" />
                  <span className="text-muted dark:text-slate-300">{c.reason}</span>
                </div>
              )}
              <a
                href={courseSearchUrl(c)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm bg-sky-500 text-white hover:bg-sky-600 shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Start Learning <ExternalLink size={14} />
              </a>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
