import { useEffect, useState } from 'react'
import { CheckCircle2, Rocket, Target, Loader2, Lightbulb, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import WeekQuiz from '../components/WeekQuiz.jsx'
import EstimatedCompletion from '../components/EstimatedCompletion.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { api } from '../data/api.js'
import { fallbackRoadmap } from '../data/mockData.js'

export default function Roadmap() {
  const { state, update } = useApp()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(!state.roadmap)
  const [error, setError] = useState('')

  useEffect(() => {
    if (state.roadmap) {
      setLoading(false)
      return
    }
    generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const generate = async (isRegenerate) => {
    setLoading(true)
    setError('')
    try {
      const data = await api.generateRoadmap({
        profile: state.profile,
        assessment: state.assessment,
      })
      update({ roadmap: data })
      if (isRegenerate) showToast('Roadmap regenerated', 'success')
    } catch (err) {
      console.warn('Falling back to sample roadmap:', err.message)
      setError('Using a sample roadmap — connect the Flask backend + Gemini API key to generate a live one.')
      update({ roadmap: fallbackRoadmap })
      if (isRegenerate) showToast('Could not reach the AI backend — showing a sample roadmap', 'error')
    } finally {
      setLoading(false)
    }
  }

  const roadmap = state.roadmap || fallbackRoadmap

  const setConfidence = (weekNumber, value) => {
    update({ weekConfidence: { ...state.weekConfidence, [weekNumber]: value } })
    showToast(value === 'confident' ? 'Marked as confident' : 'Marked to revisit', 'info')
  }

  const exportPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const marginX = 48
    const pageWidth = doc.internal.pageSize.getWidth()
    const maxWidth = pageWidth - marginX * 2
    let y = 60

    const addWrapped = (text, fontSize, style = 'normal', gap = 16) => {
      doc.setFont('helvetica', style)
      doc.setFontSize(fontSize)
      const lines = doc.splitTextToSize(text, maxWidth)
      lines.forEach((line) => {
        if (y > 780) {
          doc.addPage()
          y = 60
        }
        doc.text(line, marginX, y)
        y += fontSize * 1.3
      })
      y += gap
    }

    addWrapped('LearnPath AI — Learning Roadmap', 20, 'bold', 6)
    addWrapped(`Career goal: ${roadmap.careerGoal || 'Not specified'}    |    Level: ${roadmap.level || 'Not specified'}`, 11, 'normal', 20)

    roadmap.weeks.forEach((w) => {
      addWrapped(`Week ${w.week}: ${w.title}`, 14, 'bold', 6)
      addWrapped(`Skills: ${w.skills?.join(', ') || '—'}`, 10, 'normal', 4)
      addWrapped(`Project: ${w.project || '—'}`, 10, 'normal', 4)
      addWrapped(`Milestone: ${w.milestone || '—'}`, 10, 'normal', 4)
      if (w.reason) addWrapped(`Why this: ${w.reason}`, 10, 'italic', 18)
      else y += 14
    })

    doc.save('learnpath-ai-roadmap.pdf')
    showToast('Roadmap PDF downloaded', 'success')
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-5 py-32 text-center">
        <Loader2 className="animate-spin mx-auto text-sky-500" size={36} />
        <p className="mt-4 text-muted dark:text-slate-300">Building your personalized roadmap...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold">Your Learning Roadmap</h1>
          <p className="text-muted dark:text-slate-300 mt-2">
            Tailored for <strong>{roadmap.careerGoal || 'your career goal'}</strong> · Level: <strong>{roadmap.level}</strong>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportPdf}>
            <Download size={16} /> Export PDF
          </Button>
          <Button variant="outline" onClick={() => generate(true)}>
            <Rocket size={16} /> Regenerate
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 rounded-lg px-4 py-2 mt-4">
          {error}
        </p>
      )}

      <EstimatedCompletion roadmap={roadmap} profile={state.profile} weekConfidence={state.weekConfidence} />

      <div className="mt-10 relative pl-8 border-l-2 border-dashed border-slate-200 dark:border-slate-700 space-y-8">
        {roadmap.weeks.map((w, i) => (
          <div key={w.week} className="relative animate-fadeUp" style={{ animationDelay: `${i * 0.08}s` }}>
            <span className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-sky-400 text-white text-xs flex items-center justify-center font-semibold">
              {w.week}
            </span>
            <Card tint={['skyblue', 'mint', 'lavender'][i % 3]}>
              <h3 className="font-semibold text-lg">{w.title}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {w.skills.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-white/70 dark:bg-slate-900/40 font-medium">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-2 text-sm">
                <Rocket size={16} className="mt-0.5 shrink-0 text-sky-600" />
                <span><strong>Project:</strong> {w.project}</span>
              </div>
              <div className="mt-2 flex items-start gap-2 text-sm">
                <Target size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                <span><strong>Milestone:</strong> {w.milestone}</span>
              </div>

              {w.reason && (
                <div className="mt-3 flex items-start gap-2 text-xs bg-white/60 dark:bg-slate-900/40 rounded-lg px-3 py-2">
                  <Lightbulb size={14} className="mt-0.5 shrink-0 text-amber-500" />
                  <span className="text-muted dark:text-slate-300"><strong>Why this:</strong> {w.reason}</span>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-muted dark:text-slate-300 mr-1">Confident with this?</span>
                <button
                  onClick={() => setConfidence(w.week, 'confident')}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                    state.weekConfidence?.[w.week] === 'confident'
                      ? 'bg-emerald-400 text-emerald-950'
                      : 'bg-white/70 dark:bg-slate-900/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/40'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfidence(w.week, 'revisit')}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                    state.weekConfidence?.[w.week] === 'revisit'
                      ? 'bg-amber-400 text-amber-950'
                      : 'bg-white/70 dark:bg-slate-900/40 hover:bg-amber-100 dark:hover:bg-amber-950/40'
                  }`}
                >
                  Need to revisit
                </button>
              </div>

              <WeekQuiz week={w} />
            </Card>
          </div>
        ))}
        <div className="relative">
          <span className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-emerald-400 text-white flex items-center justify-center">
            <CheckCircle2 size={14} />
          </span>
          <p className="text-sm text-muted dark:text-slate-300 pt-1">You're on your way. New weeks unlock as you progress.</p>
        </div>
      </div>
    </div>
  )
}
