import { CalendarClock } from 'lucide-react'

// Assumption: each roadmap week represents about 8 focused hours of content
// (a reasonable week's worth of tutorials + a small project). This is an
// estimate, not a guarantee — shown transparently in the UI.
const HOURS_PER_ROADMAP_WEEK = 8
// Assumption: students realistically study on 6 of 7 days, not every single day.
const STUDY_DAYS_PER_WEEK = 6

function parseDailyHours(dailyStudyTime) {
  if (!dailyStudyTime) return 1 // sensible default if profile is incomplete
  if (dailyStudyTime === '4+') return 4.5
  const n = parseFloat(dailyStudyTime)
  return Number.isFinite(n) && n > 0 ? n : 1
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function EstimatedCompletion({ roadmap, profile, weekConfidence }) {
  const totalWeeks = roadmap?.weeks?.length || 0
  if (totalWeeks === 0) return null

  const confidentCount = roadmap.weeks.filter((w) => weekConfidence?.[w.week] === 'confident').length
  const remainingWeeks = Math.max(totalWeeks - confidentCount, 0)

  const dailyHours = parseDailyHours(profile?.dailyStudyTime)
  const weeklyHours = dailyHours * STUDY_DAYS_PER_WEEK
  const hoursRemaining = remainingWeeks * HOURS_PER_ROADMAP_WEEK
  const calendarWeeksNeeded = weeklyHours > 0 ? hoursRemaining / weeklyHours : 0

  const today = new Date()
  const completionDate = new Date(today)
  completionDate.setDate(today.getDate() + Math.ceil(calendarWeeksNeeded * 7))

  if (remainingWeeks === 0) {
    return (
      <div className="mt-6 rounded-2xl shadow-soft px-5 py-4 border border-white/60 dark:border-slate-700/60 bg-gradient-to-br from-mint via-skyblue to-lavender dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 flex items-center gap-3">
        <CalendarClock size={20} className="text-emerald-600 shrink-0" />
        <p className="text-sm">
          <strong>You've marked every week confident!</strong> Nice work — regenerate your roadmap for the next stretch.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 rounded-2xl shadow-soft px-5 py-4 border border-white/60 dark:border-slate-700/60 bg-gradient-to-br from-skyblue via-mint to-lavender dark:from-slate-800 dark:via-slate-800 dark:to-slate-800">
      <div className="flex items-start gap-3">
        <CalendarClock size={20} className="text-sky-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm">
            At <strong>{dailyHours}h/day</strong> ({remainingWeeks} week{remainingWeeks !== 1 ? 's' : ''} remaining),
            you're on track to finish by <strong>{formatDate(completionDate)}</strong>.
          </p>
          <p className="text-xs text-muted dark:text-slate-300 mt-1">
            Estimate assumes ~{HOURS_PER_ROADMAP_WEEK}h of content per roadmap week and studying {STUDY_DAYS_PER_WEEK} days/week. Mark weeks "confident" to update this.
          </p>
        </div>
      </div>
    </div>
  )
}
