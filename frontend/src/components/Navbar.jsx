import { Link, useNavigate } from 'react-router-dom'
import { Moon, Sun, Menu, X, GraduationCap } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'

export default function Navbar() {
  const { state, toggleTheme, logout } = useApp()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const links = state.user
    ? [
        ['Dashboard', '/dashboard'],
        ['Roadmap', '/roadmap'],
        ['Courses', '/courses'],
        ['Planner', '/planner'],
        ['Assistant', '/assistant'],
        ['Code Review', '/code-review'],
        ['Achievements', '/achievements'],
      ]
    : [
        ['Home', '/'],
        ['Features', '/#features'],
      ]

  return (
    <header className="sticky top-0 z-50 glass shadow-softer">
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="w-9 h-9 rounded-xl bg-skyblue dark:bg-slate-700 flex items-center justify-center">
            <GraduationCap size={20} className="text-sky-600 dark:text-sky-300" />
          </span>
          LearnPath <span className="text-sky-500">AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted dark:text-slate-300">
          {links.map(([label, href]) => (
            <Link key={label} to={href} className="hover:text-ink dark:hover:text-white transition-colors">
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {state.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          {state.user ? (
            <>
              <Link to="/settings" className="text-sm font-medium text-muted dark:text-slate-300 hover:text-ink dark:hover:text-white">
                {state.user.name}
              </Link>
              <button
                onClick={async () => { await logout(); navigate('/') }}
                className="text-sm font-medium px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Log in
              </Link>
              <Link to="/signup" className="text-sm font-medium px-4 py-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors shadow-soft">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden px-5 pb-4 flex flex-col gap-3 animate-fadeUp">
          {links.map(([label, href]) => (
            <Link key={label} to={href} onClick={() => setOpen(false)} className="text-sm font-medium py-1">
              {label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
              {state.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            {state.user ? (
              <button onClick={async () => { await logout(); navigate('/') }} className="text-sm font-medium px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800">
                Log out
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800">Log in</Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="text-sm font-medium px-4 py-2 rounded-full bg-sky-500 text-white">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}