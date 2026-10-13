import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 dark:border-slate-800 mt-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="w-8 h-8 rounded-lg bg-skyblue dark:bg-slate-700 flex items-center justify-center">
            <GraduationCap size={16} className="text-sky-600 dark:text-sky-300" />
          </span>
          LearnPath AI
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted dark:text-slate-400">
          <Link to="/about" className="hover:text-ink dark:hover:text-white">About</Link>
          <Link to="/contact" className="hover:text-ink dark:hover:text-white">Contact</Link>
          <Link to="/privacy" className="hover:text-ink dark:hover:text-white">Privacy Policy</Link>
          <Link to="/faq" className="hover:text-ink dark:hover:text-white">FAQ</Link>
        </div>
        <p className="text-xs text-muted dark:text-slate-500">© {new Date().getFullYear()} LearnPath AI. Built for learners.</p>
      </div>
    </footer>
  )
}
