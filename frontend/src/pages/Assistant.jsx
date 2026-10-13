import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Bot, User } from 'lucide-react'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import { api } from '../data/api.js'

const suggestions = [
  'What should I learn next?',
  'Explain closures in JavaScript',
  'Recommend a beginner project',
  'Suggest interview prep topics',
]

export default function Assistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your learning assistant. Ask me what to learn next, request a topic explanation, or get project ideas." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text) => {
    const msg = text ?? input
    if (!msg.trim()) return
    const nextMessages = [...messages, { role: 'user', text: msg }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)
    try {
      const data = await api.sendChatMessage({ message: msg, history: nextMessages })
      setMessages((m) => [...m, { role: 'assistant', text: data.reply }])
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: "I can't reach the AI backend right now. Once you connect your Flask server and Gemini API key, I'll answer live — for now here's a placeholder: keep building small projects and revisit fundamentals weekly." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 flex flex-col h-[85vh]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Sparkles size={22} className="text-sky-500" /> AI Study Assistant</h1>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden p-0">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-skyblue dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  m.role === 'user'
                    ? 'bg-sky-500 text-white rounded-br-sm'
                    : 'bg-slate-100 dark:bg-slate-800 rounded-bl-sm'
                }`}
              >
                {m.text}
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-mint dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}
          {loading && <div className="text-xs text-muted dark:text-slate-400 pl-11">Thinking...</div>}
          <div ref={endRef} />
        </div>

        <div className="px-5 pb-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send() }}
          className="border-t border-slate-100 dark:border-slate-800 p-4 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your learning path..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-sky-400 outline-none"
          />
          <Button type="submit" disabled={loading}><Send size={16} /></Button>
        </form>
      </Card>
    </div>
  )
}
