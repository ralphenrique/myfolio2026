export type NavItem = {
  id: string
  label: string
}

export type ProjectTile = {
  title: string
  summary: string
  type: string
  year: string
  stack: string[]
  metric?: string
  link?:string
}

export type SkillGroup = {
  title: string
  items: string[]
}

export type ExperienceEntry = {
  role: string
  company: string
  year: string
  summary: string
  featured?: boolean
}

export type ContactHighlight = {
  title: string
  detail: string
  color?: string
}

export type ContactMethod = {
  label: string
  value: string
  href: string
  note: string
}

export const navItems: NavItem[] = [
  { id: 'about', label: 'About me' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills-tools', label: 'Skills & Tools' },
  { id: 'contact', label: 'Contact' },
]

export const projectTiles: ProjectTile[] = [
  {
    title: 'CHEDOnse',
    summary: 'Developed a mobile app using React Native & TypeScript, centralizing all HEI across Region 11, Philippines. Developed the map screen of the app, showing all locations of all HEIs with search & filter.',
    type: 'Client project',
    year: '2025',
    stack: ['React Native', 'MySQL', 'Tailwind'],
    
  },
  {
    title: 'Fotohaus Booking System',
    summary: 'Developed a web app using ReactJS, TypeScript, & Supabase for the Go Kodak Fotohaus to track their Fotohaus Bookings in kanban style improving efficiency & a landing page for their clients to book ',
    type: 'Client Project',
    year: '2025',
    stack: ['React', 'Supabase', 'Tailwind'],
    link:'https://www.gofotohaus.com/booking'
  },
  {
    title: 'Google Developer Groups Davao Landing Page',
    summary: 'Designed & Developed using ReactJS & TypeScript the landing page for the Google Developer Groups Davao to effectively showcase latest/upcoming events and drive engagement.',
    type: 'Client Project',
    year: '2025',
    stack: ['React', 'Tailwind'],
    link:"https://www.gdgdavao.org/"
  },
  {
    title: 'Kusinaries',
    summary: 'Developed a capstone system (2 mobile apps/1 web admin) using React Native, ReactJS, TypeScript, and Supabase, featuring an AI-Assisted Meal Planner (Gemini 2.0) to combat malnutrition/stunting.',
    type: 'Capstone study',
    year: '2025',
    stack: ['React Native', 'React', 'Supabase', 'Gemini API'],
    link:"https://kusinaries-capstone.vercel.app/"
  },
  {
    title: 'Pomodoroad',
    summary: 'Developed a motivational web app using ReactJS, TypeScript & Google Maps API that transforms goal-oriented work into a simulated cross-country journey to boost focus and task completion.',
    type: 'Personal Project',
    year: '2025',
    stack: ['React', 'Tailwind', 'Google Maps API'],
    link:"https://pomodoroad.vercel.app/"
  },
]

export const skillGroups: SkillGroup[] = [
  {
    title: 'Frontend',
    items: ['JavaScript', 'TypeScript', 'React', 'React Native', 'Vue.js', 'Tailwind CSS', 'Vite'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Laravel', 'PHP', 'Express.js', 'PostgreSQL', 'MySQL', 'Python'],
  },
  {
    title: 'DevOps & Cloud',
    items: ['Docker', 'Vercel', 'GitHub Actions', 'Digital Ocean'],
  },
  {
    title: 'Security & Identity',
    items: ['OAuth', 'JWT', 'Auth0', 'Supabase Auth'],
  },
]

export const experienceTimeline: ExperienceEntry[] = [
  {
    role: 'Full-Stack Developer (Intern)',
    company: 'Commission on Higher Education Region XI',
    year: '2026',
    summary: 'Developed a background worker OCR using Tesseract OCR & pdftoppm, allowing searching specific text content of uploaded documents on the web app.',
    featured: true,
  },
  {
    role: 'Full-Stack Developer (Start-up)',
    company: 'DotSide Studios',
    year: '2025',
    summary: 'Maintained and developed on backend new features (new role & org subscription) using Directus, allowing daily users to log in and personalize their feed by subscribing to organizations.',
  },
  {
    role: 'Campus Organizer',
    company: 'Google Developer Groups On Campus - University of the Immaculate Conception',
    year: '2024',
    summary: 'Managed a team of 10 officers, organizing 4 workshops (Github, UIUX, Google AI Studio, VSCode) & 2 partnership deals (UX Davao, Globe), covering over 250+ highly-engaged participants.',
  },
  {
    role: 'Hello World! 👋🏻',
    company: 'Wrote my first line of code',
    year: '2022',
    summary: 'Got curious with building things on the web and never stopped shipping.',
  },
]

export const contactHighlights: ContactHighlight[] = [
  {
    title: 'Availability',
    detail: 'Open to work',
    color: 'green-500'
  },
  {
    title: 'Response time',
    detail: 'Replies within 24 hours on weekdays, quicker for active engagements.',
  },
  {
    title: 'Location',
    detail: 'Based in Davao City · Able to work EST · Preferrably remote work, on-site can be discussed.',
  },
]

export const contactMethods: ContactMethod[] = [
  {
    label: 'Email',
    value: 'enriqueralph@gmail.com',
    href: 'mailto:enriqueralph@gmail.com',
    note: 'Best for product briefs, collabs, and introductions.',
  },
  {
    label: 'Calendly',
    value: 'Book a 30-min call',
    href: 'https://calendly.com/ralphenrique/intro',
    note: 'Ideal for quick chemistry checks or handoffs.',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/ralphenrique',
    href: 'https://www.linkedin.com/in/ralphenrique/',
    note: 'Connect for public updates and recommendations.',
  },
  {
    label: 'Telegram',
    value: '@ralph.codes',
    href: 'https://t.me/ralphdotcodes',
    note: 'Fastest channel for project follow-ups.',
  },
]
