import { Footprints, Flame, Trophy, Hammer, Map, Sparkles, Award, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import Card from '../components/Card.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const badges = [
  { id: 1, name: 'First Steps', description: 'Completed your first lesson', earned: true, icon: 'Footprints' },
  { id: 2, name: '7-Day Streak', description: 'Studied 7 days in a row', earned: true, icon: 'Flame' },
  { id: 3, name: 'Quiz Master', description: 'Scored 90%+ on an assessment', earned: true, icon: 'Trophy' },
  { id: 4, name: 'Project Builder', description: 'Submitted your first project', earned: false, icon: 'Hammer' },
  { id: 5, name: 'Roadmap Complete', description: 'Finished a full learning roadmap', earned: false, icon: 'Map' },
  { id: 6, name: '30-Day Streak', description: 'Studied 30 days in a row', earned: false, icon: 'Sparkles' },
]

const iconMap = { Footprints, Flame, Trophy, Hammer, Map, Sparkles }

export default function Achievements() {
  const { state } = useApp()
  const { showToast } = useToast()
  const earnedCount = badges.filter((b) => b.earned).length
  const studentName = state.profile?.name || state.user?.name || 'LearnPath AI Student'

  const exportBadge = (badge) => {
    const doc = new jsPDF({ unit: 'pt', format: [420, 300] })

    // Card background + border, matching the app's soft palette
    doc.setFillColor(248, 250, 252) // base
    doc.rect(0, 0, 420, 300, 'F')
    doc.setDrawColor(224, 242, 254) // skyblue
    doc.setLineWidth(6)
    doc.rect(3, 3, 414, 294)

    doc.setTextColor(30, 41, 59)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('LEARNPATH AI', 210, 45, { align: 'center' })

    doc.setFontSize(22)
    doc.text(badge.name, 210, 100, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    doc.text(badge.description, 210, 130, { align: 'center' })

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(11)
    doc.text(`Awarded to ${studentName}`, 210, 190, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    doc.text(new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), 210, 215, { align: 'center' })

    doc.save(`${badge.name.replace(/\s+/g, '-').toLowerCase()}-badge.pdf`)
    showToast(`${badge.name} badge downloaded`, 'success')
  }

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14">
      <h1 className="text-3xl font-bold">Achievements</h1>
      <p className="text-muted dark:text-slate-300 mt-2">{earnedCount} of {badges.length} badges earned · {state.progress.xp} XP</p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((b, i) => {
          const Icon = iconMap[b.icon] || Award
          return (
            <Card
              key={b.id}
              tint={b.earned ? ['skyblue', 'mint', 'lavender'][i % 3] : undefined}
              className={`text-center animate-fadeUp ${!b.earned ? 'opacity-50 grayscale' : ''}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/70 dark:bg-slate-900/40 flex items-center justify-center mx-auto mb-3">
                <Icon size={26} />
              </div>
              <h3 className="font-semibold">{b.name}</h3>
              <p className="text-xs text-muted dark:text-slate-300 mt-1">{b.description}</p>
              {!b.earned ? (
                <p className="text-xs mt-2 font-medium text-slate-400">Locked</p>
              ) : (
                <button
                  onClick={() => exportBadge(b)}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900/70 transition-colors"
                >
                  <Download size={13} /> Download Card
                </button>
              )}
            </Card>
          )
        })}
      </div>

      <Card className="mt-8">
        <h3 className="font-semibold mb-4">Certificates</h3>
        <p className="text-sm text-muted dark:text-slate-300">
          Complete a full roadmap to unlock a downloadable certificate of completion. You're {Math.round((state.progress.completedLessons / state.progress.totalLessons) * 100)}% of the way there.
        </p>
      </Card>
    </div>
  )
}
