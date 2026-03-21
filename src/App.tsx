
import { useEffect, useRef, useState } from 'react'
import profileImg from './assets/profile.jpeg'
import { Map, Code, BadgeCheck, Instagram, Linkedin, Github, List, ArrowUpRight, Mic } from 'lucide-react'
import {
  contactHighlights,
  experienceTimeline,
  navItems,
  projectTiles,
  skillGroups,
} from './data/content'

const TAP_SOUNDS = ['/tap_01.wav', '/tap_02.wav', '/tap_03.wav', '/tap_04.wav', '/tap_05.wav'] as const
const SELECT_SOUND = '/select.wav'
const NAME_SOUND = '/myname.mp3'
const THEME_STORAGE_KEY = 'theme-preference'
const AUDIO_FILES = [...TAP_SOUNDS, SELECT_SOUND, NAME_SOUND]

let sharedAudioContext: AudioContext | null = null
let sharedAudioBuffers: Record<string, AudioBuffer> | null = null
let sharedAudioPromise: Promise<void> | null = null

const getAudioContextConstructor = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const extendedWindow = window as typeof window & {
    webkitAudioContext?: typeof AudioContext
  }

  return window.AudioContext || extendedWindow.webkitAudioContext || null
}

const preloadSharedAudio = async (AudioContextCtor: typeof AudioContext) => {
  if (!sharedAudioContext) {
    sharedAudioContext = new AudioContextCtor()
  }

  const context = sharedAudioContext

  if (sharedAudioBuffers) {
    return { context, buffers: sharedAudioBuffers }
  }

  if (!sharedAudioPromise) {
    sharedAudioPromise = (async () => {
      const entries = await Promise.all(
        AUDIO_FILES.map(async (src) => {
          const response = await fetch(src)
          const arrayBuffer = await response.arrayBuffer()
          const buffer = await context.decodeAudioData(arrayBuffer)
          return [src, buffer] as const
        })
      )
      sharedAudioBuffers = Object.fromEntries(entries)
    })()
  }

  try {
    await sharedAudioPromise
  } catch (error) {
    console.error('Failed to preload audio assets', error)
  }

  return { context, buffers: sharedAudioBuffers ?? {} }
}

type ThemeMode = 'light' | 'dark'

const getPreferredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [activeSection, setActiveSection] = useState('about')
  const [theme, setTheme] = useState<ThemeMode>(() => getPreferredTheme())
  const contentRef = useRef<HTMLDivElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioBuffersRef = useRef<Record<string, AudioBuffer>>({})

  useEffect(() => {
    const cleanups: Array<() => void> = []
    const container = contentRef.current

    if (container) {
      const updateActiveSection = () => {
        const sectionElements = Array.from(container.querySelectorAll<HTMLElement>('[data-section-id]'))
        if (!sectionElements.length) {
          return
        }

        const containerRect = container.getBoundingClientRect()
        const containerCenter = containerRect.top + containerRect.height / 2

        let closest = sectionElements[0]
        let closestDistance = Number.POSITIVE_INFINITY

        for (const section of sectionElements) {
          const rect = section.getBoundingClientRect()
          const sectionBottom = rect.bottom
          const distance = Math.abs(sectionBottom - containerCenter)

          if (distance < closestDistance) {
            closestDistance = distance
            closest = section
          }
        }

        const nextActive = closest.dataset.sectionId
        if (nextActive) {
          setActiveSection(nextActive)
        }
      }

      updateActiveSection()
      container.addEventListener('scroll', updateActiveSection, { passive: true })
      window.addEventListener('resize', updateActiveSection)
      cleanups.push(() => {
        container.removeEventListener('scroll', updateActiveSection)
        window.removeEventListener('resize', updateActiveSection)
      })
    }

    const AudioContextCtor = getAudioContextConstructor()
    if (AudioContextCtor) {
      let cancelled = false
      preloadSharedAudio(AudioContextCtor).then(({ context, buffers }) => {
        if (cancelled) {
          return
        }
        audioContextRef.current = context
        audioBuffersRef.current = buffers
      })
      cleanups.push(() => {
        cancelled = true
      })
    }

    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    }

    return () => {
      cleanups.forEach((fn) => fn())
    }
  }, [theme])

  const scrollToSection = (sectionId: string) => {
    const container = contentRef.current
    if (!container) {
      return
    }

    const section = container.querySelector<HTMLElement>(`[data-section-id="${sectionId}"]`)
    if (!section) {
      return
    }

    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Content collections are sourced from src/data/content.ts

  const activeIndex = Math.max(0, navItems.findIndex((item) => item.id === activeSection))

  const playBuffer = (src: string) => {
    const context = audioContextRef.current
    const buffer = audioBuffersRef.current[src]
    if (!context || !buffer) {
      return
    }

    if (context.state === 'suspended') {
      context.resume().catch(() => { })
    }

    const source = context.createBufferSource()
    source.buffer = buffer
    source.connect(context.destination)
    source.start()
  }

  const playPop = () => {
    const randomSrc = TAP_SOUNDS[Math.floor(Math.random() * TAP_SOUNDS.length)]
    playBuffer(randomSrc)
  }

  const playSelect = () => {
    playBuffer(SELECT_SOUND)
  }

  const playNameAudio = () => {
    playBuffer(NAME_SOUND)
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1126px] flex-col border-x border-dashed border-[var(--border)] text-center">
      <section className="relative h-[60px] max-[1024px]:h-12 after:absolute after:bottom-0 after:left-1/2 after:h-0 after:w-screen after:-translate-x-1/2 after:border-b after:border-dashed after:border-[var(--border)] after:content-['']"></section>

      <div className="relative z-10 w-full before:absolute before:z-10 before:top-[-4.5px] before:left-0 before:border-5 before:border-transparent before:border-l-[var(--border)] before:content-[''] after:absolute after:z-10 after:top-[-4.5px] after:right-0 after:border-5 after:border-transparent after:border-r-[var(--border)] after:content-['']"></div>

      <section className="relative flex min-h-0 grow text-left max-[1024px]:flex-col max-[1024px]:text-center before:absolute before:top-0 before:left-1/2 before:h-0 before:w-screen before:-translate-x-1/2 before:border-t before:border-dashed before:border-[var(--border)] before:content-['']">
        <div className="relative flex min-h-0 flex-col lg:h-[calc(100vh-120px)] lg:basis-1/4 lg:flex-none lg:overflow-y-auto lg:border-r lg:border-dashed lg:border-[var(--border)] max-[1024px]:border-b max-[1024px]:border-[var(--border)] max-[1024px]:px-5 max-[1024px]:py-6">
          <div className="flex flex-col gap-0">
            <div className=" border-[var(--border)] px-4 py-4">
              <img
                src={profileImg}
                alt="Ralph Kris Enrique"
                className=" aspect-square w-full  object-cover"
              />
            </div>

            <div className='flex flex-col items-start border-y px-4 border-[var(--border)] py-2'>
              <span className='flex w-fit items-center gap-2'>
                <h2 className="m-0 font-[var(--heading)] text-lg font-medium leading-[1.18] tracking-[-0.24px] text-[var(--text-h)] max-[1024px]:text-[20px]">
                  Ralph Kris Enrique
                </h2>
                <BadgeCheck className="h-4 w-4 text-blue-400 " />
                <Mic className="h-4 w-4 hover:cursor-pointer " onClick={playNameAudio} aria-label="Play name audio" />

              </span>
              <h2 className="m-0 text-sm">@ralphenrique</h2>

            </div>

            <span className='flex flex-col gap-1 border-b px-4 py-2 border-[var(--border)] '>
              <span className='flex w-fit items-center gap-1'>
                <Code className="h-3 w-3" aria-hidden="true" />
                <h2 className="m-0 text-xs">Full-Stack Developer · <span className='text-green-500'>Open to work</span></h2>
              </span>
              <span className='flex w-fit items-center gap-1'>
                <Map className="h-3 w-3" aria-hidden="true" />
                <h2 className="m-0 text-xs">Davao City, Philippines</h2>
              </span>
            </span>

            <span className='flex border-b border-[var(--border)] '>
              <a
                className='flex flex-1 justify-center items-center border-r border-[var(--border)] py-4 transition-colors duration-200 hover:cursor-pointer hover:bg-[var(--social-bg)]'
                onMouseEnter={playPop}
                onClick={playSelect}
                href="mailto:enriqueralph@gmail.com"
              >
                <h2 className="m-0 text-sm ">Email</h2>
                <ArrowUpRight className='h-4 w-4' />
              </a>
              <a
                className='flex flex-1 justify-center items-center py-4 transition-colors duration-200 hover:cursor-pointer hover:bg-[var(--social-bg)]'
                onMouseEnter={playPop}
                onClick={playSelect}
                href='/ENRIQUE_RESUME.pdf'
                download
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Download Ralph Kris Enrique resume PDF'
              >
                <h2 className="m-0 text-sm ">Resume</h2>
                <ArrowUpRight className='h-4 w-4' />

              </a>
            </span>

            <span className='flex border-b border-[var(--border)] '>
              <a
                className='flex flex-1 justify-center border-r border-[var(--border)] py-4 transition-colors duration-200 hover:cursor-pointer hover:bg-[var(--social-bg)]'
                onMouseEnter={playPop}
                onClick={playSelect}
                href='https://www.instagram.com/rlphnrq/'
                target='_blank'
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                className='flex flex-1 justify-center border-r border-[var(--border)] py-4 transition-colors duration-200 hover:cursor-pointer hover:bg-[var(--social-bg)]'
                onMouseEnter={playPop}
                onClick={playSelect}
                href='https://www.linkedin.com/in/ralphenrique/'
                target='_blank'
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                className='flex flex-1 justify-center  border-[var(--border)] py-4 transition-colors duration-200 hover:cursor-pointer hover:bg-[var(--social-bg)]'
                onMouseEnter={playPop}
                onClick={playSelect}
                href='https://github.com/ralphenrique'
                target='_blank'
              >
                <Github className="h-4 w-4" aria-hidden="true" />
              </a>
            </span>

            <div className='relative flex flex-col gap-2 border-b py-2 border-[var(--border)]'>
              <span className='flex w-fit items-center gap-1 mb-2 px-4'>
                <List className="h-3 w-3  text-[var(--text-h)]" aria-hidden="true" />
                <h2 className="m-0 text-xs font-bold text-[var(--text-h)]">PAGE CONTENT</h2>
              </span>

              <div className="relative">
                <div
                  aria-hidden="true"
                  className="hidden sm:block absolute sm:right-0 sm:top-1 sm:h-7 sm:w-[2px] sm:bg-[var(--outline-marker)] sm:transition-transform sm:duration-300 sm:ease-out"
                  style={{ transform: `translateY(${activeIndex * 36}px)` }}
                />

                <div className="flex flex-col">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        playSelect()
                        scrollToSection(item.id)
                      }}
                      onMouseEnter={playPop}
                      className="flex h-9 items-center gap-1 pl-4 text-left transition-colors duration-200 hover:cursor-pointer hover:bg-[var(--social-bg)]"
                    >
                      <h2 className="m-0 text-xs">{item.label}</h2>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className='relative flex flex-col gap-3 border-b border-[var(--border)] px-4 py-3'>
              <button
                type="button"
                aria-label="Toggle color theme"
                aria-pressed={theme === 'dark'}
                className='flex items-center justify-between border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-left text-sm font-semibold text-[var(--text-h)] transition-colors duration-200 hover:cursor-pointer hover:bg-[var(--social-bg)]'
                onClick={() => {
                  playSelect()
                  toggleTheme()
                }}
                onMouseEnter={playPop}
              >
                <span className='text-[10px] font-mono uppercase tracking-[0.4em]'>{theme === 'light' ? 'DAY' : 'NIGHT'}</span>
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden border-[var(--border)] ">
            <div className="h-full w-full bg-[repeating-linear-gradient(135deg,_var(--grid-line)_0px,_var(--grid-line)_1px,transparent_1px,transparent_10px)]"></div>
          </div>

    
        </div>

        <div
          ref={contentRef}
          className="h-[calc(100vh-120px)] min-w-0 flex-1 overflow-x-hidden overflow-y-auto py-4 max-[1024px]:h-[calc(100vh-96px)] max-[1024px]:px-5 max-[1024px]:py-6"
        >
          <div className="space-y-4">
            <section
              data-section-id="about"
              className="flex min-h-[20vh] flex-col text-start justify-between  border-[var(--border)] p-5"
            >
              <div>
                <h3 className="m-0 text-basefont-semibold text-[var(--text-h)]">About Me</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text)]">
                  I am an aspiring Full-Stack Developer dedicated to building web and mobile solutions using React, Vue, and PHP. I work on projects including helping businesses scale through digital transformation, creating modern applications that streamline operations and empower clients to thrive in a digital-first world.
                </p>

                <p className="mt-3 text-sm leading-6 text-[var(--text)]">
                  Being a developer in 2026 means constantly learning and adapting to an ever-evolving technological landscape. That is why I actively seek out collaborative projects across various organizations and dedicate myself to building personal projects—not just as a hobby, but as a deliberate practice to expand my technical horizons.              </p>

                <p className="mt-3 text-sm leading-6 text-[var(--text)]">
                  This allows me to adapt to new projects and unfamiliar tech stacks, shortening the learning curve.
                </p>

              </div>
            </section>


            <section
              data-section-id="experience"
              className="flex min-h-[50vh] text-start flex-col justify-between border-[var(--border)] p-5"
            >
              <div>
                <h3 className="m-0 text-base font-semibold text-[var(--text-h)]">Experience</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text)]">
                  Roles across fintech, dev tooling, and product studios—each focused on shipping measurable outcomes.
                </p>
              </div>

              <div className="relative mt-5 space-y-5 text-left">
                <div className="absolute left-[9px] top-2 bottom-2 w-px bg-[var(--border)]"></div>
                {experienceTimeline.map((item) => (
                  <article key={`${item.role}-${item.year}`} className="group/role relative pl-8">
                    <span
                      className={`absolute left-[4px] top-[5px] h-3 w-3 border-2 transition-colors ${item.featured ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--border)] bg-[var(--bg)]'}`}
                    ></span>

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--text-h)] group-hover/role:text-[var(--accent)]">{item.role}</h4>
                        <p className="text-xs text-[var(--text)]">{item.company}</p>
                      </div>

                      <span className="border border-[var(--border)] bg-[var(--social-bg)] px-2 py-1 text-[10px] font-mono text-[var(--text)]">
                        {item.year}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-[var(--text)]">
                      {item.summary}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section
              data-section-id="projects"
              className="flex min-h-[50vh] flex-col text-start justify-between border-[var(--border)] p-5"
            >
              <div>
                <h3 className="m-0 text-base font-semibold text-[var(--text-h)]">Projects</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text)]">
                  A collection of product-focused work: portfolio builds, dashboard interfaces, and full-stack apps with
                  real-world workflows.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {projectTiles.map((project) => (
                  <a
                    key={`${project.title}-${project.year}`}
                    className="group flex min-h-[190px] flex-col justify-between border border-dashed border-[var(--border)] bg-[var(--bg)] p-4 hover:cursor-pointer hover:bg-[var(--social-bg)]"
                    href={project.link}
                    target="_blank"
                    onMouseEnter={playPop}
                    onClick={playSelect}
                  >
                    <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text)] opacity-70">
                      <span>{project.type}</span>
                      <span>{project.year}</span>
                    </div>

                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-[var(--text-h)]">{project.title}</h4>
                      <p className="mt-2 text-xs leading-5 text-[var(--text)]">{project.summary}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-[var(--text)]">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="border border-[var(--border)] bg-[var(--social-bg)] px-2 py-1 uppercase tracking-wide"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[11px] font-semibold text-[var(--text-h)]">
                      <span>{project.metric}</span>
                      {project.link && (
                        <span className="inline-flex items-center gap-1 text-[var(--accent)]">
                          Link
                          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </span>

                      )}
                    </div>
                  </a>
                ))}
              </div>
            </section>

            <section
              data-section-id="skills-tools"
              className="flex min-h-[50vh] flex-col text-start border-[var(--border)] p-5"
            >
              <div>
                <h3 className="m-0 text-base font-semibold text-[var(--text-h)]">Skills & Tools</h3>
              </div>

              <div className="mt-5 space-y-6 text-left">
                {skillGroups.map((group) => (
                  <div key={group.title}>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text)] opacity-70">
                      {group.title}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs font-medium tracking-wide text-[var(--text-h)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>


            <section
              data-section-id="contact"
              className="flex min-h-[50vh] flex-col text-start border-[var(--border)] p-5"
            >
              <div>
                <h3 className="m-0 text-base font-semibold text-[var(--text-h)]">Contact</h3>
              </div>

              <div className="mt-5 space-y-6 text-left">
                <div className="grid gap-4 md:grid-cols-3">
                  {contactHighlights.map((highlight) => (
                    <article key={highlight.title} className="border border-[var(--border)] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text)] opacity-70">
                        {highlight.title}
                      </p>
                      <p
                        className={`mt-2 text-sm leading-6 text-[var(--text-h)] ${highlight.color ? `text-${highlight.color}` : ''
                          }`}
                      >
                        {highlight.detail}
                      </p>
                    </article>
                  ))}
                </div>

                <div className="border border-dashed border-[var(--border)] p-4">
                  <a
                    onClick={playSelect}
                    onMouseEnter={playPop}
                    href="mailto:enriqueralph@gmail.com">
                    <p className="text-sm leading-6 text-[var(--text)]">
                      Interested? Send role summary, stack preferences, date and time for a conversation, so I can reply with fit and availability within 24 hours.
                    </p>
                  </a>
                </div>
              </div>
            </section>

            <footer className="flex min-h-[20vh] flex-col items-center justify-end  border-[var(--border)] p-5"
            >
              <p className='text-xs'>© Ralph Kris Enrique. All rights reserved</p>
            </footer>

          </div>
        </div>
      </section>

      <div className="relative z-10 w-full before:absolute before:z-10 before:top-[-4.5px] before:left-0 before:border-5 before:border-transparent before:border-l-[var(--border)] before:content-[''] after:absolute after:z-10 after:top-[-4.5px] after:right-0 after:border-5 after:border-transparent after:border-r-[var(--border)] after:content-['']"></div>
      <section className="relative h-[60px] max-[1024px]:h-12 after:absolute after:top-0 after:left-1/2 after:h-0 after:w-screen after:-translate-x-1/2 after:border-t after:border-dashed after:border-[var(--border)] after:content-['']"></section>
    </main>
  )
}

export default App
