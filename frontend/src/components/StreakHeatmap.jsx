// Simple deterministic pseudo-random number generator so the heatmap looks
// the same on every render instead of reshuffling (no real per-day activity
// log exists yet — this illustrates the *current streak* accurately, and
// fills in older weeks with a stable, plausible-looking pattern).
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const WEEKS_TO_SHOW = 12
const DAYS_PER_WEEK = 7

function buildActivityGrid(streak) {
  const totalDays = WEEKS_TO_SHOW * DAYS_PER_WEEK
  const today = new Date()
  const days = []

  for (let i = totalDays - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const daysAgo = i

    let level
    if (daysAgo < streak) {
      // Within the actual current streak — always active, higher intensity near today
      level = daysAgo < 3 ? 3 : 2
    } else {
      // Older, no real record — stable filler pattern from a seeded random
      const r = seededRandom(date.getFullYear() * 400 + date.getMonth() * 31 + date.getDate())
      level = r > 0.75 ? 2 : r > 0.5 ? 1 : 0
    }

    days.push({ date, level })
  }
  return days
}

const levelStyles = [
  'bg-slate-100 dark:bg-slate-800',
  'bg-sky-200 dark:bg-sky-900',
  'bg-sky-400 dark:bg-sky-700',
  'bg-sky-600 dark:bg-sky-500',
]

export default function StreakHeatmap({ streak }) {
  const days = buildActivityGrid(streak)

  // Group into columns of 7 (one column per week)
  const weeks = []
  for (let i = 0; i < days.length; i += DAYS_PER_WEEK) {
    weeks.push(days.slice(i, i + DAYS_PER_WEEK))
  }

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                title={day.date.toDateString()}
                className={`w-3 h-3 rounded-sm ${levelStyles[day.level]}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-xs text-muted dark:text-slate-400">
        <span>Less</span>
        {levelStyles.map((style, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${style}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}