import { useNavigate } from 'react-router-dom'
import Button from './Button.jsx'
import Card from './Card.jsx'

export default function EmptyState({ icon: Icon, title, body, ctaLabel, ctaTo }) {
  const navigate = useNavigate()
  return (
    <Card className="max-w-md mx-auto mt-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-skyblue dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
        <Icon size={26} className="text-sky-600 dark:text-sky-300" />
      </div>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm text-muted dark:text-slate-300 mt-2">{body}</p>
      {ctaLabel && ctaTo && (
        <Button className="mt-5" onClick={() => navigate(ctaTo)}>
          {ctaLabel}
        </Button>
      )}
    </Card>
  )
}
