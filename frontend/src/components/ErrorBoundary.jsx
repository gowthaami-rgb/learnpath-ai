import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

// Catches JavaScript errors thrown anywhere in the component tree below it
// (e.g. calling .map() on undefined, a bad API response shape, etc.) and
// shows a recovery screen instead of a blank page. This is exactly the kind
// of crash that previously made the Courses page go blank with no message.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Logged to the browser console so it's easy to find during development
    // or when debugging a report from someone testing the app.
    console.error('ErrorBoundary caught a crash:', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-5 bg-base dark:bg-slate-900">
          <div className="max-w-md w-full text-center rounded-2xl shadow-soft p-8 border border-white/60 dark:border-slate-700/60 bg-white dark:bg-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={26} className="text-amber-500" />
            </div>
            <h1 className="text-xl font-bold">Something went wrong</h1>
            <p className="text-sm text-muted dark:text-slate-300 mt-2">
              This page ran into an unexpected error. Your data is safe — try reloading, or head back to the dashboard.
            </p>
            {this.state.error && (
              <p className="mt-3 text-xs text-left bg-slate-50 dark:bg-slate-900/60 rounded-lg p-3 text-slate-500 dark:text-slate-400 font-mono break-words">
                {String(this.state.error.message || this.state.error)}
              </p>
            )}
            <div className="flex gap-3 mt-6 justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm bg-sky-500 text-white hover:bg-sky-600 shadow-soft transition-colors"
              >
                <RefreshCw size={16} /> Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Home size={16} /> Go Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}