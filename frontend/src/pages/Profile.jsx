import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import { useApp } from '../context/AppContext.jsx'

const emptyForm = {
  name: '',
  school: '',
  classYear: '',
  department: '',
  currentSkills: '',
  interests: '',
  careerGoal: '',
  dailyStudyTime: '1',
}

export default function Profile() {
  const { state, update } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...emptyForm, ...state.profile })

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    update({ profile: form })
    navigate('/assessment')
  }

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tell us about yourself</h1>
        <p className="text-muted dark:text-slate-300 mt-2">This helps the AI build a roadmap that actually fits you.</p>
      </div>

      <Card className="animate-fadeUp">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Row>
            <Text label="Full name" value={form.name} onChange={set('name')} placeholder="e.g. Aditi Sharma" required />
            <Text label="School / College" value={form.school} onChange={set('school')} placeholder="e.g. Anna University" required />
          </Row>
          <Row>
            <Text label="Class / Year" value={form.classYear} onChange={set('classYear')} placeholder="e.g. Final Year" required />
            <Text label="Department" value={form.department} onChange={set('department')} placeholder="e.g. Computer Science" required />
          </Row>
          <Textarea label="Current skills" value={form.currentSkills} onChange={set('currentSkills')} placeholder="e.g. Python, basic HTML/CSS, SQL fundamentals" />
          <Textarea label="Interests" value={form.interests} onChange={set('interests')} placeholder="e.g. web development, AI/ML, competitive programming" />
          <Row>
            <Text label="Career goal" value={form.careerGoal} onChange={set('careerGoal')} placeholder="e.g. Frontend Developer" required />
            <div>
              <label className="text-sm font-medium block mb-1.5">Daily study time (hours)</label>
              <select
                value={form.dailyStudyTime}
                onChange={set('dailyStudyTime')}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-sky-400 outline-none"
              >
                {['0.5', '1', '2', '3', '4+'].map((h) => (
                  <option key={h} value={h}>{h} hours</option>
                ))}
              </select>
            </div>
          </Row>
          <Button type="submit" className="w-full mt-2">Continue to Skill Assessment</Button>
        </form>
      </Card>
    </div>
  )
}

function Row({ children }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>
}

function Text({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1.5">{label}</label>
      <input
        {...props}
        type="text"
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-sky-400 outline-none"
      />
    </div>
  )
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1.5">{label}</label>
      <textarea
        {...props}
        rows={2}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-sky-400 outline-none resize-none"
      />
    </div>
  )
}
