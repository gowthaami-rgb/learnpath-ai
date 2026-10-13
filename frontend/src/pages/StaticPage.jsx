import Card from '../components/Card.jsx'

export default function StaticPage({ title, body }) {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <Card>
        <p className="text-sm leading-relaxed text-muted dark:text-slate-300">{body}</p>
      </Card>
    </div>
  )
}
