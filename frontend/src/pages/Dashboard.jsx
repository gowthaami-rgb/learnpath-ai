import { Flame, BookOpen, Target, Clock, UserCircle } from 'lucide-react'
import Card from '../components/Card.jsx'
import TodayFocus from '../components/TodayFocus.jsx'
import StreakHeatmap from '../components/StreakHeatmap.jsx'
import OnboardingTour from '../components/OnboardingTour.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useApp } from '../context/AppContext.jsx'

export default function Dashboard() {
  const { state } = useApp()
  const { completedLessons, totalLessons, streak, weeklyGoalHours, studyHoursThisWeek, xp } = state.progress
  const pct = Math.round((completedLessons / totalLessons) * 100)
  const circumference = 2 * Math.PI * 54

  if (!state.profile) {
    return (
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <EmptyState
          icon={UserCircle}
          title="Let's set up your profile first"
          body="Your dashboard comes alive once you've told us a bit about yourself — it only takes a couple of minutes."
          ctaLabel="Complete Your Profile"
          ctaTo="/profile"
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
      {!state.hasSeenTour && <OnboardingTour />}

      <h1 className="text-3xl font-bold">Welcome back{state.user ? `, ${state.profile?.name?.split(' ')[0] || state.user.name}` : ''} 👋</h1>
      <p className="text-muted dark:text-slate-300 mt-2">Here's how your learning journey is going.</p>

      <div className="mt-6">
        <TodayFocus />
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <Card tint="skyblue" className="flex flex-col items-center justify-center text-center lg:col-span-1">
          <svg width="140" height="140" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="54" fill="none" stroke="#0EA5E9" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (pct / 100) * circumference}
              transform="rotate(-90 60 60)"
            />
            <text x="60" y="66" textAnchor="middle" fontSize="22" fontWeight="700" fill="currentColor">{pct}%</text>
          </svg>
          <p className="font-medium mt-2">Overall Progress</p>
          <p className="text-sm text-muted dark:text-slate-300">{completedLessons} of {totalLessons} lessons complete</p>
        </Card>

        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
          <StatCard icon={Flame} tint="mint" label="Learning Streak" value={`${streak} days`} />
          <StatCard icon={BookOpen} tint="lavender" label="Lessons Remaining" value={totalLessons - completedLessons} />
          <StatCard icon={Target} tint="skyblue" label="Weekly Goal" value={`${studyHoursThisWeek} / ${weeklyGoalHours} hrs`} />
          <StatCard icon={Clock} tint="mint" label="XP Points" value={`${xp} XP`} />
        </div>
      </div>

      <Card className="mt-6">
        <h3 className="font-semibold mb-4">This week's study hours</h3>
        <div className="flex items-end gap-3 h-32">
          {[3, 5, 2, 6, 4, 1, 2].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-sky-300 to-sky-400 dark:from-sky-700 dark:to-sky-600"
                style={{ height: `${(h / 6) * 100}%` }}
              />
              <span className="text-xs text-muted dark:text-slate-400">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6">
        <h3 className="font-semibold mb-1">Activity — last 12 weeks</h3>
        <p className="text-xs text-muted dark:text-slate-400 mb-4">Based on your current streak, with earlier weeks shown as an illustrative pattern.</p>
        <StreakHeatmap streak={streak} />
      </Card>
    </div>
  )
}

function StatCard({ icon: Icon, tint, label, value }) {
  return (
    <Card tint={tint}>
      <div className="w-10 h-10 rounded-xl bg-white/70 dark:bg-slate-900/40 flex items-center justify-center mb-3">
        <Icon size={18} />
      </div>
      <p className="text-sm text-muted dark:text-slate-300">{label}</p>
      <p className="text-xl font-bold mt-0.5">{value}</p>
    </Card>
  )
}
