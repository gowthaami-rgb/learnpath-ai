import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import Card from '../components/Card.jsx'
import { useApp } from '../context/AppContext.jsx'
import { api } from '../data/api.js'
import { skillGapFallback } from '../data/mockData.js'

export default function SkillGap() {
  const { state } = useApp()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .analyzeSkillGap({ profile: state.profile, careerGoal: state.profile?.careerGoal })
      .then(setData)
      .catch(() => setData(skillGapFallback))
      .finally(() => setLoading(false))
  }, [state.profile])

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-5 py-32 text-center">
        <Loader2 className="animate-spin mx-auto text-sky-500" size={36} />
        <p className="mt-4 text-muted dark:text-slate-300">Analyzing your skill gap...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
      <h1 className="text-3xl font-bold">Skill Gap Analysis</h1>
      <p className="text-muted dark:text-slate-300 mt-2">
        Comparing your current skills against what's needed for <strong>{data.careerGoal}</strong>.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 gap-6">
        <Card tint="mint">
          <h3 className="font-semibold flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-600" /> Skills you have</h3>
          <ul className="mt-4 space-y-2">
            {data.haveSkills.map((s) => (
              <li key={s} className="text-sm px-3 py-2 rounded-lg bg-white/70 dark:bg-slate-900/40">{s}</li>
            ))}
          </ul>
        </Card>
        <Card tint="lavender">
          <h3 className="font-semibold flex items-center gap-2"><AlertCircle size={18} className="text-purple-600" /> Skills to improve</h3>
          <ul className="mt-4 space-y-2">
            {data.improveSkills.map((s) => (
              <li key={s} className="text-sm px-3 py-2 rounded-lg bg-white/70 dark:bg-slate-900/40">{s}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="font-semibold mb-4">Recommended next steps</h3>
        <div className="space-y-3">
          {data.nextSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <ArrowRight size={16} className="mt-0.5 shrink-0 text-sky-500" />
              <span>{step}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
