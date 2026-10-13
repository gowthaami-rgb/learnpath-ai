import { useEffect, useState } from 'react'
import { Loader2, Clock3, Sparkles } from 'lucide-react'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { api } from '../data/api.js'

const fallbackPlan = [
  { time: '7:00 AM – 8:00 AM', task: 'Review yesterday\'s notes + flashcards' },
  { time: '8:00 AM – 9:30 AM', task: 'Deep work: current roadmap topic' },
  { time: '6:00 PM – 7:00 PM', task: 'Practice problems / mini project work' },
  { time: '7:00 PM – 7:30 PM', task: 'Watch a short tutorial on tomorrow\'s topic' },
]

export default function Planner() {
  const { state } = useApp()
  const { showToast } = useToast()
  const [hours, setHours] = useState(3)
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState('')
  const [todayFocus, setTodayFocus] = useState(null)
  const [focusLoading, setFocusLoading] = useState(true)

  // Pull in today's priority task (same source as the Dashboard widget) so
  // the generated timetable actually builds around it, instead of the two
  // features being disconnected.
  useEffect(() => {
    api
      .getTodayFocus({ roadmap: state.roadmap, profile: state.profile, weekConfidence: state.weekConfidence })
      .then((data) => setTodayFocus(data.focus))
      .catch(() => setTodayFocus(null))
      .finally(() => setFocusLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const generate = async () => {
    setLoading(true)
    setNote('')
    try {
      const data = await api.generateStudyPlan({ hours, todayFocus })
      setPlan(data.schedule)
      showToast('Timetable generated', 'success')
    } catch (err) {
      setNote('Backend not connected — showing a sample timetable.')
      setPlan(fallbackPlan)
      showToast('Could not reach the AI backend — showing a sample timetable', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
      <h1 className="text-3xl font-bold">AI Study Planner</h1>
      <p className="text-muted dark:text-slate-300 mt-2">Tell us your available hours today, and we'll build a realistic schedule.</p>

      {!focusLoading && todayFocus && (
        <div className="mt-5 rounded-xl px-4 py-3 bg-gradient-to-br from-skyblue via-mint to-lavender dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 flex items-start gap-2.5">
          <Sparkles size={16} className="text-sky-600 mt-0.5 shrink-0" />
          <p className="text-sm">
            <strong>Today's Focus:</strong> {todayFocus} — your timetable below will build around this.
          </p>
        </div>
      )}

      <Card className="mt-6">
        <label className="text-sm font-medium block mb-2">Available study hours today: <strong>{hours}</strong></label>
        <input
          type="range"
          min="0.5"
          max="8"
          step="0.5"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="w-full accent-sky-500"
        />
        <Button className="mt-6" onClick={generate} disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Clock3 size={16} />}
          Generate Timetable
        </Button>
        {note && <p className="text-xs text-amber-600 dark:text-amber-300 mt-3">{note}</p>}
      </Card>

      {plan && (
        <div className="mt-8 space-y-3 animate-fadeUp">
          {plan.map((slot, i) => (
            <Card key={i} tint={['skyblue', 'mint', 'lavender'][i % 3]} className="flex items-center gap-4">
              <span className="text-sm font-semibold whitespace-nowrap">{slot.time}</span>
              <span className="text-sm text-muted dark:text-slate-200">{slot.task}</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
