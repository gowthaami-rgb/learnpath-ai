import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db, googleProvider, isFirebaseConfigured } from '../firebase.js'

const AppContext = createContext(null)

const STORAGE_KEY = 'learnpath_ai_state'

const defaultData = {
  profile: null,
  assessment: null,
  roadmap: null,
  weekConfidence: {}, // { [weekNumber]: 'confident' | 'revisit' }
  hasSeenTour: false,
  progress: {
    completedLessons: 4,
    totalLessons: 20,
    streak: 3,
    weeklyGoalHours: 10,
    studyHoursThisWeek: 6,
    xp: 320,
  },
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaultData, ...JSON.parse(raw) } : defaultData
  } catch {
    return defaultData
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [data, setData] = useState(defaultData)
  const [theme, setTheme] = useState(localStorage.getItem('learnpath_theme') || 'light')
  const [authLoading, setAuthLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('learnpath_theme', theme)
  }, [theme])
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setData(loadLocal())
      return
    }
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser({ uid: fbUser.uid, name: fbUser.displayName || fbUser.email.split('@')[0], email: fbUser.email })
        const snap = await getDoc(doc(db, 'users', fbUser.uid))
        setData(snap.exists() ? { ...defaultData, ...snap.data() } : defaultData)
      } else {
        setUser(null)
        setData(defaultData)
      }
      setAuthLoading(false)
    })
    return unsub
  }, [])

  const update = useCallback(
    async (patch) => {
      setData((prev) => {
        const next = { ...prev, ...patch }
        if (!isFirebaseConfigured) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        }
        return next
      })
      if (isFirebaseConfigured && user) {
        await setDoc(doc(db, 'users', user.uid), patch, { merge: true })
      }
    },
    [user]
  )

  const signUpEmail = async (name, email, password) => {
    if (!isFirebaseConfigured) {
      setUser({ uid: 'demo', name, email })
      return
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    await setDoc(doc(db, 'users', cred.user.uid), { ...defaultData, name, email }, { merge: true })
  }

  const signInEmail = async (email, password) => {
    if (!isFirebaseConfigured) {
      setUser({ uid: 'demo', name: email.split('@')[0], email })
      return
    }
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signInGoogle = async () => {
    if (!isFirebaseConfigured) {
      setUser({ uid: 'demo', name: 'Demo User', email: 'you@gmail.com' })
      return
    }
    const cred = await signInWithPopup(auth, googleProvider)
    await setDoc(
      doc(db, 'users', cred.user.uid),
      { name: cred.user.displayName, email: cred.user.email },
      { merge: true }
    )
  }

  const resetPassword = async (email) => {
    if (!isFirebaseConfigured) return
    await sendPasswordResetEmail(auth, email)
  }

  const logout = async () => {
    if (isFirebaseConfigured) await signOut(auth)
    setUser(null)
    setData(defaultData)
  }

  // Fully resets profile/assessment/roadmap/progress back to defaults —
  // used by the "Reset my data" button in Settings. Unlike update(), this
  // is a full overwrite, not a merge, so stale fields don't survive.
  const resetData = async () => {
    setData(defaultData)
    if (!isFirebaseConfigured) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData))
    }
    if (isFirebaseConfigured && user) {
      await setDoc(doc(db, 'users', user.uid), defaultData)
    }
  }

  const value = {
    state: { user, theme, ...data },
    update,
    toggleTheme,
    signUpEmail,
    signInEmail,
    signInGoogle,
    resetPassword,
    logout,
    resetData,
    authLoading,
    isFirebaseConfigured,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
