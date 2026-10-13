import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-5 py-32 text-center">
      <h1 className="text-6xl font-bold text-sky-500">404</h1>
      <p className="mt-4 text-muted dark:text-slate-300">This page doesn't exist yet — maybe it's on your roadmap.</p>
      <Link to="/" className="inline-block mt-6"><Button>Back Home</Button></Link>
    </div>
  )
}
