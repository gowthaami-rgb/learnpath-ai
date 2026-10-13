export const quizQuestions = [
  { id: 1, q: 'How comfortable are you writing functions with parameters and return values?', options: ['Never tried', 'Can do it with help', 'Comfortable on my own', 'I could teach it'] },
  { id: 2, q: 'Have you built a project using an API (weather, maps, etc.)?', options: ['No idea what an API is', 'Heard of it, not tried', 'Built one small project', 'Built several'] },
  { id: 3, q: 'How do you handle version control (Git)?', options: ['I don\'t', 'I can commit and push', 'I use branches and PRs', 'I resolve merge conflicts confidently'] },
  { id: 4, q: 'Rate your understanding of data structures (arrays, trees, graphs).', options: ['Basic arrays only', 'Arrays and lists', 'Trees, stacks, queues too', 'Graphs and advanced structures'] },
  { id: 5, q: 'Have you deployed an app to the internet?', options: ['Never', 'Followed a tutorial once', 'Deployed my own project', 'Deploy regularly with CI/CD'] },
  { id: 6, q: 'How do you approach debugging a broken program?', options: ['I get stuck quickly', 'Trial and error', 'Read errors, use breakpoints', 'Systematic root-cause analysis'] },
  { id: 7, q: 'Do you understand how databases relate to each other (SQL joins, etc.)?', options: ['No', 'Basic SELECT queries', 'Joins and relationships', 'Query optimization too'] },
  { id: 8, q: 'How familiar are you with a frontend framework (React, Vue, etc.)?', options: ['Not at all', 'Following tutorials', 'Built small apps', 'Built production-level apps'] },
  { id: 9, q: 'Can you explain Big-O complexity for common algorithms?', options: ['Never heard of it', 'Vaguely', 'Yes, for common cases', 'Yes, and I optimize for it'] },
  { id: 10, q: 'Have you contributed to a team codebase (open source or work)?', options: ['No', 'Small solo projects only', 'Collaborated on a team project', 'Regular contributor / maintainer'] },
]

export const recommendedCourses = [
  { id: 1, name: 'CS50: Introduction to Computer Science', platform: 'Harvard / edX', duration: '11 weeks', difficulty: 'Beginner', color: 'skyblue', free: true, searchQuery: 'CS50 Introduction to Computer Science edX', reason: 'A strong, free foundation if core CS concepts still feel shaky.' },
  { id: 2, name: 'The Complete React Developer Course', platform: 'Udemy', duration: '38 hours', difficulty: 'Intermediate', color: 'mint', free: false, searchQuery: 'The Complete React Developer Course Udemy', reason: 'Matches your React roadmap weeks with hands-on project practice.' },
  { id: 3, name: 'Data Structures & Algorithms Specialization', platform: 'Coursera', duration: '6 months', difficulty: 'Intermediate', color: 'lavender', free: false, searchQuery: 'Data Structures Algorithms Specialization Coursera', reason: 'Fills the DSA gap that often shows up in technical interviews.' },
  { id: 4, name: 'Machine Learning Specialization', platform: 'DeepLearning.AI', duration: '3 months', difficulty: 'Advanced', color: 'skyblue', free: false, searchQuery: 'Machine Learning Specialization DeepLearning.AI', reason: 'A good stretch goal once your core fundamentals are confident.' },
  { id: 5, name: 'Flask & REST API Development', platform: 'freeCodeCamp', duration: '10 hours', difficulty: 'Beginner', color: 'mint', free: true, searchQuery: 'Flask REST API Development freeCodeCamp', reason: 'Free and directly useful if you want to understand backend basics too.' },
  { id: 6, name: 'System Design Interview Prep', platform: 'Educative', duration: '5 weeks', difficulty: 'Advanced', color: 'lavender', free: false, searchQuery: 'System Design Interview Prep Educative', reason: 'Worth adding once you\'re closer to applying for roles.' },
]

export const badges = [
  { id: 1, name: 'First Steps', description: 'Completed your first lesson', earned: true, icon: 'Footprints' },
  { id: 2, name: '7-Day Streak', description: 'Studied 7 days in a row', earned: true, icon: 'Flame' },
  { id: 3, name: 'Quiz Master', description: 'Scored 90%+ on an assessment', earned: true, icon: 'Trophy' },
  { id: 4, name: 'Project Builder', description: 'Submitted your first project', earned: false, icon: 'Hammer' },
  { id: 5, name: 'Roadmap Complete', description: 'Finished a full learning roadmap', earned: false, icon: 'Map' },
  { id: 6, name: '30-Day Streak', description: 'Studied 30 days in a row', earned: false, icon: 'Sparkles' },
]

export const fallbackRoadmap = {
  level: 'Intermediate',
  careerGoal: 'Frontend Developer',
  weeks: [
    {
      week: 1,
      title: 'Foundations & Environment Setup',
      skills: ['HTML5 semantics', 'CSS Flexbox & Grid', 'Git basics'],
      project: 'Build a responsive personal portfolio page',
      milestone: 'Comfortable structuring and styling a page from scratch',
      reason: 'Recommended first because a solid frontend foundation makes every later week easier to follow.',
    },
    {
      week: 2,
      title: 'JavaScript Fundamentals',
      skills: ['ES6+ syntax', 'DOM manipulation', 'Async/await & fetch'],
      project: 'Build a weather app using a public API',
      milestone: 'Can fetch and render live data from an API',
      reason: 'Builds directly on Week 1 by adding interactivity and real data to what you already built.',
    },
    {
      week: 3,
      title: 'React Core Concepts',
      skills: ['Components & props', 'State & hooks', 'Conditional rendering'],
      project: 'Build a to-do list app with local state',
      milestone: 'Can build a multi-component React app',
      reason: 'Once JS fundamentals are solid, this is the natural next step toward the React roles you\'re targeting.',
    },
    {
      week: 4,
      title: 'Routing, State Management & APIs',
      skills: ['React Router', 'Context API', 'REST integration'],
      project: 'Build a multi-page app that talks to a backend API',
      milestone: 'Can structure a real-world React application',
      reason: 'Ties everything together into the kind of full app structure real frontend roles expect.',
    },
  ],
}

export const skillGapFallback = {
  careerGoal: 'Frontend Developer',
  haveSkills: ['HTML/CSS', 'JavaScript basics', 'Git'],
  improveSkills: ['React state management', 'TypeScript', 'Testing (Jest)'],
  nextSteps: [
    'Build 2 projects using React hooks and context',
    'Take a short TypeScript crash course and refactor an old project',
    'Write unit tests for one existing project using Jest + React Testing Library',
  ],
}

// Generic fallback quiz shown if the Flask backend / Gemini isn't reachable,
// so the "Practice Quiz" feature still demos correctly offline.
export const fallbackWeekQuiz = {
  questions: [
    {
      id: 'q1',
      question: 'You want to reuse the same visual layout across multiple pages. What\'s the best approach?',
      options: ['Copy-paste the HTML into every page', 'Build a reusable component and import it where needed', 'Write a separate CSS file per page', 'Use inline styles everywhere'],
      correctIndex: 1,
      explanation: 'Reusable components avoid duplication and keep your layout consistent and easy to update.',
    },
    {
      id: 'q2',
      question: 'A function needs to fetch data before rendering it. What should you use?',
      options: ['A synchronous for-loop', 'async/await with fetch', 'window.alert()', 'CSS animations'],
      correctIndex: 1,
      explanation: 'async/await lets you wait for the network response before using the data, without blocking the page.',
    },
    {
      id: 'q3',
      question: 'Your page layout breaks on smaller screens. What\'s the most relevant fix?',
      options: ['Increase font size only', 'Use responsive units and flex/grid layouts', 'Remove all CSS', 'Add more images'],
      correctIndex: 1,
      explanation: 'Responsive layout techniques (flexbox/grid, relative units) adapt content to different screen sizes.',
    },
    {
      id: 'q4',
      question: 'You made a mistake in your last Git commit message. What\'s a safe fix before pushing?',
      options: ['Delete the whole repository', 'git commit --amend', 'Create a new GitHub account', 'Ignore it permanently'],
      correctIndex: 1,
      explanation: '`git commit --amend` lets you edit the most recent commit (message or contents) before it\'s pushed.',
    },
  ],
}