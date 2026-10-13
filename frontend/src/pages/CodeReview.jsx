import { useState } from 'react'
import { Code2, Loader2, CheckCircle2, AlertTriangle, Sparkles, Copy, Check } from 'lucide-react'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import { api } from '../data/api.js'
import { useToast } from '../context/ToastContext.jsx'

export default function CodeReview() {
  const { showToast } = useToast()
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('Python')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const submit = async () => {
    if (!code.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    setCopied(false)
    try {
      const data = await api.reviewCode({ code, language })
      setResult(data)
      showToast('Code review ready', 'success')
    } catch (err) {
      setError('Could not reach the AI backend — check that Flask is running and your Gemini key is set.')
      showToast('Could not reach the AI backend', 'error')
    } finally {
      setLoading(false)
    }
  }

  const copyImprovedCode = async () => {
    try {
      await navigator.clipboard.writeText(result.improvedCode)
      setCopied(true)
      showToast('Copied to clipboard', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('Could not copy — select and copy manually', 'error')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
      <h1 className="text-3xl font-bold flex items-center gap-2"><Code2 size={26} className="text-sky-500" /> AI Code Review</h1>
      <p className="text-muted dark:text-slate-300 mt-2">Paste a snippet from your project and get specific, explained feedback — not just pass/fail.</p>

      <Card className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Your code</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          >
            {['Python', 'JavaScript', 'Java', 'C++', 'Other'].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={10}
          placeholder="Paste your code here..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono outline-none focus:ring-2 focus:ring-sky-400 resize-y"
        />
        <Button className="mt-4" onClick={submit} disabled={loading || !code.trim()}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          Review My Code
        </Button>
        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      </Card>

      {result && (
        <div className="mt-8 space-y-6 animate-fadeUp">
          <Card tint="skyblue">
            <h3 className="font-semibold mb-2">Overall</h3>
            <p className="text-sm text-muted dark:text-slate-200">{result.summary}</p>
          </Card>

          {result.strengths?.length > 0 && (
            <Card tint="mint">
              <h3 className="font-semibold flex items-center gap-2 mb-3"><CheckCircle2 size={18} className="text-emerald-600" /> What's working well</h3>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-sm px-3 py-2 rounded-lg bg-white/70 dark:bg-slate-900/40">{s}</li>
                ))}
              </ul>
            </Card>
          )}

          {result.issues?.length > 0 && (
            <Card tint="lavender">
              <h3 className="font-semibold flex items-center gap-2 mb-3"><AlertTriangle size={18} className="text-purple-600" /> Issues to fix</h3>
              <div className="space-y-4">
                {result.issues.map((issue, i) => (
                  <div key={i} className="bg-white/70 dark:bg-slate-900/40 rounded-lg p-3 text-sm">
                    <p className="font-medium">{issue.problem}</p>
                    <p className="text-muted dark:text-slate-300 mt-1"><strong>Why it matters:</strong> {issue.why_it_matters}</p>
                    <p className="text-muted dark:text-slate-300 mt-1"><strong>Suggestion:</strong> {issue.suggestion}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {result.improvedCode && (
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Improved version</h3>
                <button
                  onClick={copyImprovedCode}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="text-xs sm:text-sm bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto font-mono">
                {result.improvedCode}
              </pre>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
