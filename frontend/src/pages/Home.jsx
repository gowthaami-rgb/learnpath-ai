import { Link } from 'react-router-dom'
import { Sparkles, Target, BarChart3, MessageCircleQuestion, Route as RouteIcon, Trophy } from 'lucide-react'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'

const features = [
  { icon: RouteIcon, title: 'Personalized Roadmap', desc: 'A week-by-week plan built from your skills, goals, and pace — not a generic syllabus.', tint: 'skyblue' },
  { icon: Target, title: 'Skill Gap Analysis', desc: 'See exactly what separates you from your career goal, and what to learn next.', tint: 'mint' },
  { icon: BarChart3, title: 'Progress Dashboard', desc: 'Track streaks, study hours, and completed lessons at a glance.', tint: 'lavender' },
  { icon: MessageCircleQuestion, title: 'AI Study Assistant', desc: 'Ask what to learn next, get topics explained, or prep for interviews.', tint: 'skyblue' },
  { icon: Sparkles, title: 'Adaptive Study Planner', desc: 'Tell it your free hours — it builds a realistic daily timetable.', tint: 'mint' },
  { icon: Trophy, title: 'Achievements & XP', desc: 'Badges, streaks, and certificates that keep momentum going.', tint: 'lavender' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fadeUp">
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-lavender text-purple-700 dark:bg-purple-950 dark:text-purple-300 mb-5">
              <Sparkles size={14} /> Powered by AI
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
              Learn Smarter with Your <span className="text-sky-500">Personalized AI</span> Learning Path
            </h1>
            <p className="mt-5 text-lg text-muted dark:text-slate-300 max-w-xl">
              Get a customized roadmap based on your skills, interests, goals, and learning pace.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/signup"><Button variant="primary" className="text-base px-6 py-3">Get Started</Button></Link>
              <a href="#features"><Button variant="outline" className="text-base px-6 py-3">Explore Features</Button></a>
            </div>
          </div>

          <div className="relative animate-fadeUp" style={{ animationDelay: '0.15s' }}>
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-5 sm:px-8 pb-24 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold">Everything you need to stay on track</h2>
          <p className="mt-3 text-muted dark:text-slate-300">One calm workspace instead of ten scattered tabs.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Card key={f.title} tint={f.tint} className="hover:-translate-y-1 transition-transform duration-300">
              <div className="w-11 h-11 rounded-xl bg-white/70 dark:bg-slate-900/40 flex items-center justify-center mb-4">
                <f.icon size={20} className="text-slate-700 dark:text-slate-200" />
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted dark:text-slate-300 mt-2">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-skyblue via-mint to-lavender dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 p-10 sm:p-14 text-center shadow-soft">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to see your path?</h2>
          <p className="mt-3 text-muted dark:text-slate-300">Takes about 5 minutes: a short profile and skill check, then your roadmap is ready.</p>
          <Link to="/signup" className="inline-block mt-6">
            <Button variant="primary" className="text-base px-6 py-3">Create My Roadmap</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 520 420" className="w-full h-auto animate-floatSlow" role="img" aria-label="Illustration of students learning with AI assistance">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#F3E8FF" />
        </linearGradient>
      </defs>
      <rect x="10" y="30" width="500" height="360" rx="28" fill="url(#skyGrad)" />
      {/* Laptop */}
      <rect x="160" y="160" width="200" height="130" rx="10" fill="#ffffff" stroke="#CBD5E1" />
      <rect x="175" y="175" width="170" height="90" rx="4" fill="#DCFCE7" />
      <path d="M140 290 L380 290 L400 310 L120 310 Z" fill="#E2E8F0" />
      {/* AI sparkle above laptop */}
      <circle cx="260" cy="120" r="26" fill="#38BDF8" opacity="0.9" />
      <path d="M260 108 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 Z" fill="#ffffff" />
      {/* Roadmap nodes coming from screen */}
      <circle cx="200" cy="210" r="6" fill="#4ADE80" />
      <circle cx="240" cy="200" r="6" fill="#38BDF8" />
      <circle cx="280" cy="215" r="6" fill="#C084FC" />
      <circle cx="320" cy="200" r="6" fill="#4ADE80" />
      <path d="M200 210 L240 200 L280 215 L320 200" stroke="#94A3B8" strokeWidth="2" fill="none" strokeDasharray="4 4" />
      {/* Student left */}
      <circle cx="90" cy="260" r="22" fill="#FDE68A" />
      <rect x="68" y="282" width="44" height="60" rx="14" fill="#38BDF8" />
      {/* Student right */}
      <circle cx="430" cy="250" r="22" fill="#FCA5A5" />
      <rect x="408" y="272" width="44" height="60" rx="14" fill="#4ADE80" />
      {/* Book */}
      <rect x="60" y="100" width="46" height="34" rx="4" fill="#C084FC" opacity="0.85" />
      <rect x="410" y="90" width="46" height="34" rx="4" fill="#F87171" opacity="0.7" />
    </svg>
  )
}
