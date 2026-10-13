import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import { quizQuestions } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import { CheckCircle2 } from 'lucide-react'

function computeLevel(answers) {
  const total = Object.values(answers).reduce((sum, v) => sum + v, 0)
  const max = quizQuestions.length * 3
  const pct = total / max
  if (pct < 0.4) return 'Beginner'
  if (pct < 0.75) return 'Intermediate'
  return 'Advanced'
}

export default function Assessment() {
  const { update } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  const q = quizQuestions[step]
  const progress = ((step) / quizQuestions.length) * 100

  const selectAnswer = (optionIndex) => {
    const next = { ...answers, [q.id]: optionIndex }
    setAnswers(next)
    if (step < quizQuestions.length - 1) {
      setStep(step + 1)
    } else {
      const level = computeLevel(next)
      setResult(level)
      update({ assessment: { level, answers: next } })
    }
  }

  if (result) {
    return (
      <div className="max-w-xl mx-auto px-5 sm:px-8 py-20 text-center">
        <Card className="animate-fadeUp">
          <CheckCircle2 size={44} className="text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Assessment complete!</h1>
          <p className="text-muted dark:text-slate-300 mt-2">Based on your answers, your current level is</p>
          <div className="mt-5 inline-block px-6 py-2.5 rounded-full bg-mint text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-lg">
            {result}
          </div>
          <Button className="w-full mt-8" onClick={() => navigate('/roadmap')}>
            Generate My Roadmap
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-5 sm:px-8 py-14">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted dark:text-slate-300 mb-2">
          <span>Question {step + 1} of {quizQuestions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-sky-400 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Card key={q.id} className="animate-fadeUp">
        <h2 className="text-lg font-semibold">{q.q}</h2>
        <div className="mt-5 space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={opt}
              onClick={() => selectAnswer(i)}
              className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors text-sm"
            >
              {opt}
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
