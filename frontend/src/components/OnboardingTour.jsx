import { useState } from 'react'
import { Route as RouteIcon, BookOpen, BarChart3, MessageCircleQuestion, Trophy, X } from 'lucide-react'
import Button from './Button.jsx'
import { useApp } from '../context/AppContext.jsx'

const steps = [
  {
    icon: RouteIcon,
    title: 'Your Roadmap',
    body: "This is your AI-generated, week-by-week learning plan — built from your profile and skill assessment. Mark weeks confident or revisit as you go.",
  },
  {
    icon: BookOpen,
    title: 'Recommended Courses',
    body: 'Video courses matched to your career goal and current level. Toggle "Free only" if budget matters, or search to narrow things down.',
  },
  {
    icon: BarChart3,
    title: 'Your Dashboard',
    body: "Today's Focus picks one specific thing to work on right now. Below it, track your streak, XP, and overall progress.",
  },
  {
    icon: MessageCircleQuestion,
    title: 'AI Assistant & Code Review',
    body: "Stuck on something? Ask the AI Assistant, or paste code into Code Review for structured feedback.",
  },
  {
    icon: Trophy,
    title: 'Achievements',
    body: "Badges, XP, and certificates as you go — a way to see how far you've come, not just what's left.",
  },
]

export default function OnboardingTour() {
  const { update } = useApp()
  const [step, setStep] = useState(0)

  const finish = () => update({ hasSeenTour: true })
  const isLast = step === steps.length - 1
  const current = steps[step]

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-5 bg-slate-900/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl shadow-soft p-7 bg-white dark:bg-slate-800 border border-white/60 dark:border-slate-700/60 animate-fadeUp">
        <button
          onClick={finish}
          aria-label="Skip tour"
          className="absolute top-4 right-4 text-muted dark:text-slate-400 hover:text-ink dark:hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="w-12 h-12 rounded-xl bg-skyblue dark:bg-slate-700 flex items-center justify-center mb-4">
          <current.icon size={22} className="text-sky-600 dark:text-sky-300" />
        </div>

        <h2 className="text-lg font-bold">{current.title}</h2>
        <p className="text-sm text-muted dark:text-slate-300 mt-2">{current.body}</p>

        <div className="flex items-center gap-1.5 mt-6 mb-5">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-sky-500' : 'w-1.5 bg-slate-200 dark:bg-slate-600'}`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button onClick={finish} className="text-sm text-muted dark:text-slate-400 hover:text-ink dark:hover:text-white">
            Skip
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>Back</Button>
            )}
            <Button onClick={() => (isLast ? finish() : setStep((s) => s + 1))}>
              {isLast ? "Let's go" : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
