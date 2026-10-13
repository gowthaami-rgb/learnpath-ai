import { useState } from 'react'
import { ClipboardCheck, Loader2, CheckCircle2, XCircle, RotateCcw } from 'lucide-react'
import Button from './Button.jsx'
import { api } from '../data/api.js'
import { fallbackWeekQuiz } from '../data/mockData.js'
import { useToast } from '../context/ToastContext.jsx'

export default function WeekQuiz({ week }) {
  const { showToast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [questions, setQuestions] = useState(null)
  const [answers, setAnswers] = useState({}) // { [questionId]: selectedIndex }
  const [submitted, setSubmitted] = useState(false)

  const startQuiz = async () => {
    setOpen(true)
    if (questions) return // already loaded, just re-open
    setLoading(true)
    setError('')
    try {
      const data = await api.getWeekQuiz({ week })
      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('Malformed response from /api/week-quiz')
      }
      setQuestions(data.questions)
    } catch (err) {
      console.warn('Falling back to sample quiz:', err.message)
      setError('Using a sample quiz — connect the Flask backend + Gemini API key for a quiz tailored to this week.')
      setQuestions(fallbackWeekQuiz.questions)
    } finally {
      setLoading(false)
    }
  }

  const selectAnswer = (qId, optionIndex) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [qId]: optionIndex }))
  }

  const allAnswered = questions && questions.every((q) => answers[q.id] !== undefined)
  const score = questions
    ? questions.filter((q) => answers[q.id] === q.correctIndex).length
    : 0

  const retry = () => {
    setAnswers({})
    setSubmitted(false)
  }

  if (!open) {
    return (
      <Button variant="secondary" className="mt-4 w-full" onClick={startQuiz}>
        <ClipboardCheck size={16} /> Practice Quiz
      </Button>
    )
  }

  return (
    <div className="mt-4 rounded-xl bg-white/70 dark:bg-slate-900/40 p-4 border border-white/60 dark:border-slate-700/60">
      {loading && (
        <div className="text-center py-6">
          <Loader2 className="animate-spin mx-auto text-sky-500" size={24} />
          <p className="mt-2 text-sm text-muted dark:text-slate-300">Building your quiz...</p>
        </div>
      )}

      {error && !loading && (
        <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 rounded-lg px-3 py-2 mb-3">
          {error}
        </p>
      )}

      {questions && !loading && (
        <div className="space-y-5">
          {questions.map((q, qi) => {
            const selected = answers[q.id]
            const isCorrect = selected === q.correctIndex
            return (
              <div key={q.id}>
                <p className="text-sm font-medium">{qi + 1}. {q.question}</p>
                <div className="mt-2 space-y-1.5">
                  {q.options.map((opt, oi) => {
                    const isSelected = selected === oi
                    let optionStyle = 'border-slate-200 dark:border-slate-700 hover:border-sky-400'
                    if (submitted && isSelected && isCorrect) optionStyle = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    else if (submitted && isSelected && !isCorrect) optionStyle = 'border-red-400 bg-red-50 dark:bg-red-950/40'
                    else if (submitted && oi === q.correctIndex) optionStyle = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    else if (isSelected) optionStyle = 'border-sky-400 bg-sky-50 dark:bg-sky-950/40'

                    return (
                      <button
                        key={oi}
                        type="button"
                        onClick={() => selectAnswer(q.id, oi)}
                        disabled={submitted}
                        className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors ${optionStyle} disabled:cursor-default`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
                {submitted && (
                  <p className={`mt-1.5 text-xs flex items-start gap-1.5 ${isCorrect ? 'text-emerald-600' : 'text-red-500'}`}>
                    {isCorrect ? <CheckCircle2 size={13} className="mt-0.5 shrink-0" /> : <XCircle size={13} className="mt-0.5 shrink-0" />}
                    {q.explanation}
                  </p>
                )}
              </div>
            )
          })}

          {!submitted ? (
            <Button
              className="w-full"
              disabled={!allAnswered}
              onClick={() => {
                setSubmitted(true)
                showToast(`Quiz submitted — scored ${score}/${questions.length}`, score === questions.length ? 'success' : 'info')
              }}
            >
              Submit Answers
            </Button>
          ) : (
            <div className="text-center pt-1">
              <p className="text-sm font-semibold">
                You scored {score} / {questions.length}
              </p>
              <Button variant="outline" className="mt-3" onClick={retry}>
                <RotateCcw size={14} /> Try Again
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
