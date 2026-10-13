const BASE_URL = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API error ${res.status}: ${text}`)
  }
  return res.json()
}

export const api = {
  generateRoadmap: (payload) =>
    request('/roadmap', { method: 'POST', body: JSON.stringify(payload) }),

  generateStudyPlan: (payload) =>
    request('/study-plan', { method: 'POST', body: JSON.stringify(payload) }),

  analyzeSkillGap: (payload) =>
    request('/skill-gap', { method: 'POST', body: JSON.stringify(payload) }),

  getCourses: (payload) =>
    request('/courses', { method: 'POST', body: JSON.stringify(payload) }),

  sendChatMessage: (payload) =>
    request('/chat', { method: 'POST', body: JSON.stringify(payload) }),

  // AI code review assistant
  reviewCode: (payload) =>
    request('/code-review', { method: 'POST', body: JSON.stringify(payload) }),

  // Auto-generated practice quiz for a specific roadmap week
  getWeekQuiz: (payload) =>
    request('/week-quiz', { method: 'POST', body: JSON.stringify(payload) }),

  // One specific, prioritized thing to focus on today
  getTodayFocus: (payload) =>
    request('/today-focus', { method: 'POST', body: JSON.stringify(payload) }),
}