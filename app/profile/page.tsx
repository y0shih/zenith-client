'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { Briefcase, CheckCircle2, ChevronRight, Clock3, MessageSquare, XCircle } from 'lucide-react'

type JobStatus = 'looking' | 'open' | 'unavailable'

const JOB_STATUS_CONFIG: Record<JobStatus, { label: string; color: string; dot: string }> = {
  looking: {
    label: 'Actively looking for work',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  open: {
    label: 'Open to opportunities',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  unavailable: {
    label: 'Not available',
    color: 'bg-muted text-muted-foreground',
    dot: 'bg-gray-400',
  },
}

interface UserProfile {
  name: string
  headline: string
  location: string
  email: string
  phone: string
  about: string
  skills: string[]
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
  cvFileName?: string
}

interface ApplicationProgress {
  id: number
  role: string
  company: string
  status: 'submitted' | 'under_review' | 'interview' | 'rejected'
  date: string
  note: string
}

type HeaderTheme = 'slate' | 'ocean' | 'forest' | 'sunset' | 'rose'

const HEADER_THEME_CONFIG: Record<
  HeaderTheme,
  {
    label: string
    headerClass: string
    avatarClass: string
    swatchClass: string
  }
> = {
  slate: {
    label: 'Slate',
    headerClass: 'from-slate-900/12 via-slate-700/10 to-slate-500/10',
    avatarClass: 'from-slate-900 to-slate-700',
    swatchClass: 'bg-slate-700',
  },
  ocean: {
    label: 'Ocean',
    headerClass: 'from-sky-600/18 via-cyan-500/12 to-blue-500/10',
    avatarClass: 'from-sky-700 to-cyan-500',
    swatchClass: 'bg-sky-500',
  },
  forest: {
    label: 'Forest',
    headerClass: 'from-emerald-700/18 via-green-500/12 to-lime-500/10',
    avatarClass: 'from-emerald-700 to-green-500',
    swatchClass: 'bg-emerald-500',
  },
  sunset: {
    label: 'Sunset',
    headerClass: 'from-amber-500/18 via-orange-500/12 to-red-500/10',
    avatarClass: 'from-orange-600 to-amber-400',
    swatchClass: 'bg-orange-500',
  },
  rose: {
    label: 'Rose',
    headerClass: 'from-rose-600/18 via-pink-500/12 to-fuchsia-500/10',
    avatarClass: 'from-rose-600 to-pink-500',
    swatchClass: 'bg-rose-500',
  },
}

type ScanStage = 'uploading' | 'scanning' | 'extracting' | 'done'

const SCAN_STAGES: { stage: ScanStage; label: string; duration: number }[] = [
  { stage: 'uploading', label: 'Uploading document...', duration: 900 },
  { stage: 'scanning', label: 'Scanning CV with AI...', duration: 1400 },
  { stage: 'extracting', label: 'Extracting profile info...', duration: 1100 },
  { stage: 'done', label: 'Profile updated!', duration: 0 },
]

const EXTRACTED_DATA: Partial<UserProfile> = {
  name: 'John Doe',
  headline: 'Senior Full Stack Engineer',
  location: 'San Francisco, CA',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  about:
    'Passionate full-stack engineer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud infrastructure.',
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Next.js', 'Redis'],
  experience: [
    {
      title: 'Senior Full Stack Engineer',
      company: 'Tech Corp',
      duration: '2021 - Present',
      description: 'Leading the development of customer-facing web applications. Mentored 5 junior developers.',
    },
    {
      title: 'Full Stack Developer',
      company: 'StartUp Inc',
      duration: '2018 - 2021',
      description: 'Built and maintained multiple React applications with Node.js backends.',
    },
    {
      title: 'Frontend Developer',
      company: 'Design Studio',
      duration: '2015 - 2018',
      description: 'Developed responsive web interfaces using React and modern CSS.',
    },
  ],
}

function CvScanModal({
  fileName,
  onComplete,
  onClose,
}: {
  fileName: string
  onComplete: (data: Partial<UserProfile>, fileName: string) => void
  onClose: () => void
}) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0)

  const advance = (idx: number) => {
    if (idx >= SCAN_STAGES.length - 1) return
    const { duration } = SCAN_STAGES[idx]
    setTimeout(() => {
      setCurrentStageIdx(idx + 1)
      advance(idx + 1)
    }, duration)
  }

  useState(() => {
    advance(0)
  })

  const isDone = currentStageIdx === SCAN_STAGES.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">AI CV Scanner</p>
              <p className="text-xs text-muted-foreground truncate max-w-[220px]">{fileName}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-3">
          {SCAN_STAGES.map((s, i) => {
            const isActive = i === currentStageIdx
            const isPast = i < currentStageIdx
            return (
              <div key={s.stage} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isPast ? 'bg-emerald-500' : isActive ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  {isPast ? (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isActive ? (
                    <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                  )}
                </div>
                <span
                  className={`text-sm transition-colors ${
                    isPast ? 'text-emerald-600 dark:text-emerald-400 line-through' : isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {s.label}
                </span>
                {isActive && !isDone ? <span className="ml-auto text-xs text-primary animate-pulse">running</span> : null}
              </div>
            )
          })}
        </div>

        {isDone ? (
          <div className="mx-6 mb-5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 space-y-1.5">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Extracted from your CV:</p>
            {[
              { label: 'Name', value: EXTRACTED_DATA.name },
              { label: 'Title', value: EXTRACTED_DATA.headline },
              { label: 'Skills', value: EXTRACTED_DATA.skills?.slice(0, 5).join(', ') + '...' },
              { label: 'Experience', value: `${EXTRACTED_DATA.experience?.length} positions` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground w-16 flex-shrink-0">{label}</span>
                <span className="text-foreground font-medium truncate">{value}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="px-6 pb-6 flex gap-3">
          {isDone ? (
            <>
              <button
                onClick={() => onComplete(EXTRACTED_DATA, fileName)}
                className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
              >
                Apply to Profile
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors cursor-pointer"
              >
                Discard
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [jobStatus, setJobStatus] = useState<JobStatus>('looking')
  const [scanFile, setScanFile] = useState<string | null>(null)
  const [headerTheme, setHeaderTheme] = useState<HeaderTheme>('ocean')
  const [useBackgroundMode, setUseBackgroundMode] = useState(false)
  const applications: ApplicationProgress[] = [
    {
      id: 1,
      role: 'Senior Golang Native',
      company: 'FluxTech',
      status: 'interview',
      date: '2026-03-20',
      note: 'Panel interview booked for next week.',
    },
    {
      id: 2,
      role: 'Backend Engineer',
      company: 'Neon',
      status: 'rejected',
      date: '2026-03-15',
      note: 'Role closed after final review.',
    },
    {
      id: 3,
      role: 'Go Developer',
      company: 'Vercel',
      status: 'under_review',
      date: '2026-03-24',
      note: 'Recruiter screening completed.',
    },
    {
      id: 4,
      role: 'Platform Engineer',
      company: 'Linear',
      status: 'submitted',
      date: '2026-03-28',
      note: 'Waiting for employer response.',
    },
  ]
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    headline: 'Senior Full Stack Engineer',
    location: 'San Francisco, CA',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    about:
      'Passionate full-stack engineer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud infrastructure. Love mentoring junior developers and contributing to open-source projects.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'UI Design'],
    experience: [
      {
        title: 'Senior Full Stack Engineer',
        company: 'Tech Corp',
        duration: '2021 - Present',
        description: 'Leading the development of customer-facing web applications. Mentored 5 junior developers.',
      },
      {
        title: 'Full Stack Developer',
        company: 'StartUp Inc',
        duration: '2018 - 2021',
        description: 'Built and maintained multiple React applications with Node.js backends.',
      },
      {
        title: 'Frontend Developer',
        company: 'Design Studio',
        duration: '2015 - 2018',
        description: 'Developed responsive web interfaces using React and modern CSS.',
      },
    ],
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setScanFile(file.name)
    e.target.value = ''
  }

  const handleScanComplete = (data: Partial<UserProfile>, fileName: string) => {
    setProfile((prev) => ({ ...prev, ...data, cvFileName: fileName }))
    setScanFile(null)
  }

  const statusCfg = JOB_STATUS_CONFIG[jobStatus]
  const activeHeaderTheme = HEADER_THEME_CONFIG[headerTheme]

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleFileSelect}
        aria-label="Upload CV"
      />

      {scanFile ? (
        <CvScanModal
          fileName={scanFile}
          onComplete={handleScanComplete}
          onClose={() => setScanFile(null)}
        />
      ) : null}

      <div className="bg-background">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_380px] gap-6 items-start">
            <div className="border border-border bg-card">
              <div
                className={`border-b border-border p-6 md:p-8 bg-gradient-to-r ${
                  useBackgroundMode
                    ? 'from-slate-950/75 via-slate-900/70 to-slate-700/65'
                    : activeHeaderTheme.headerClass
                }`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div
                        className={`w-24 h-24 bg-gradient-to-br rounded-full flex items-center justify-center text-white text-3xl font-bold ${
                          useBackgroundMode ? 'from-slate-950 to-slate-700' : activeHeaderTheme.avatarClass
                        }`}
                      >
                        JD
                      </div>
                      <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-card ${statusCfg.dot}`} />
                    </div>

                    <div className="space-y-1">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleInputChange}
                            className="text-2xl font-bold bg-card border border-border rounded px-2 py-1 text-foreground w-full"
                          />
                          <input
                            type="text"
                            name="headline"
                            value={profile.headline}
                            onChange={handleInputChange}
                            className="text-sm bg-card border border-border rounded px-2 py-1 text-muted-foreground w-full"
                          />
                        </div>
                      ) : (
                        <>
                          <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
                          <p className="text-muted-foreground">{profile.headline}</p>
                        </>
                      )}

                      {isEditing ? (
                        <select
                          id="job-status-select"
                          value={jobStatus}
                          onChange={(e) => setJobStatus(e.target.value as JobStatus)}
                          className="mt-1 text-xs px-2.5 py-1 rounded-full border border-border bg-card text-foreground cursor-pointer focus:outline-none"
                        >
                          <option value="looking">Actively looking for work</option>
                          <option value="open">Open to opportunities</option>
                          <option value="unavailable">Not available</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusCfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                          {statusCfg.label}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      id="upload-cv-btn"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload CV
                    </button>

                    <button
                      id="edit-profile-btn"
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium text-sm cursor-pointer"
                    >
                      {isEditing ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/30 bg-white/55 p-4 backdrop-blur md:flex-row md:items-end md:justify-between dark:bg-black/20">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-foreground/70">Header Appearance</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Mocked locally for now. Later this can persist as profile theme color or uploaded cover background.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 md:items-end">
                      <div className="flex items-center gap-2 flex-wrap">
                        {(Object.entries(HEADER_THEME_CONFIG) as Array<[HeaderTheme, (typeof HEADER_THEME_CONFIG)[HeaderTheme]]>).map(
                          ([key, theme]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => {
                                setHeaderTheme(key)
                                setUseBackgroundMode(false)
                              }}
                              className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-105 ${
                                headerTheme === key && !useBackgroundMode ? 'border-foreground' : 'border-white/60'
                              } ${theme.swatchClass}`}
                              aria-label={`Use ${theme.label} theme`}
                              title={theme.label}
                            />
                          )
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-muted-foreground">Use background mode</span>
                        <button
                          type="button"
                          onClick={() => setUseBackgroundMode((prev) => !prev)}
                          className={`relative h-7 w-12 rounded-full border transition-colors ${
                            useBackgroundMode ? 'border-slate-900 bg-slate-900' : 'border-border bg-white'
                          }`}
                          aria-pressed={useBackgroundMode}
                        >
                          <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                              useBackgroundMode ? 'translate-x-6' : 'translate-x-0.5 bg-slate-900'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {profile.cvFileName ? (
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>CV on file:</span>
                    <span className="font-medium text-foreground">{profile.cvFileName}</span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 rounded text-[10px] font-semibold uppercase tracking-wide">
                      AI Parsed
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="divide-y divide-border">
                <section className="p-6 md:p-8 bg-card">
                  <h2 className="text-xl font-bold text-foreground mb-4">Contact Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Email</label>
                      {isEditing ? (
                        <input type="email" name="email" value={profile.email} onChange={handleInputChange} className="w-full px-3 py-2 bg-background border border-border rounded text-foreground" />
                      ) : (
                        <p className="text-foreground">{profile.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Phone</label>
                      {isEditing ? (
                        <input type="tel" name="phone" value={profile.phone} onChange={handleInputChange} className="w-full px-3 py-2 bg-background border border-border rounded text-foreground" />
                      ) : (
                        <p className="text-foreground">{profile.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Location</label>
                      {isEditing ? (
                        <input type="text" name="location" value={profile.location} onChange={handleInputChange} className="w-full px-3 py-2 bg-background border border-border rounded text-foreground" />
                      ) : (
                        <p className="text-foreground">{profile.location}</p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="p-6 md:p-8 bg-card">
                  <h2 className="text-xl font-bold text-foreground mb-4">About</h2>
                  {isEditing ? (
                    <textarea name="about" value={profile.about} onChange={handleInputChange} rows={4} className="w-full px-3 py-2 bg-background border border-border rounded text-foreground" />
                  ) : (
                    <p className="text-foreground leading-relaxed">{profile.about}</p>
                  )}
                </section>

                <section className="p-6 md:p-8 bg-card">
                  <h2 className="text-xl font-bold text-foreground mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="p-6 md:p-8 bg-card">
                  <h2 className="text-xl font-bold text-foreground mb-4">Experience</h2>
                  <div className="space-y-6">
                    {profile.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <h3 className="font-semibold text-foreground">{exp.title}</h3>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        <p className="text-sm text-muted-foreground">{exp.duration}</p>
                        <p className="text-sm text-foreground mt-2">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <aside className="xl:sticky xl:top-6 self-start max-h-[calc(100vh-104px)] overflow-y-auto border border-border bg-muted/20">
              <div className="p-6 md:p-8 space-y-8">
                <section>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Application Progress</h2>
                      <p className="text-sm text-muted-foreground mt-1">Docked alongside the profile summary.</p>
                    </div>
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>

                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="border border-border bg-card p-4 rounded-2xl">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {app.status === 'interview' ? <CheckCircle2 className="w-5 h-5 text-chart-2" /> : null}
                            {app.status === 'rejected' ? <XCircle className="w-5 h-5 text-destructive" /> : null}
                            {app.status === 'under_review' ? <Clock3 className="w-5 h-5 text-chart-3" /> : null}
                            {app.status === 'submitted' ? <Briefcase className="w-5 h-5 text-primary" /> : null}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground leading-tight">{app.role}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{app.company}</p>
                            <p className="text-sm text-foreground mt-3 leading-relaxed">{app.note}</p>
                            <div className="flex items-center justify-between mt-4 gap-3">
                              <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 bg-primary/10 text-primary font-bold rounded-full">
                                {app.status.replace('_', ' ')}
                              </span>
                              <span className="text-xs text-muted-foreground">{app.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="border border-border rounded-2xl p-5 bg-card">
                  <h3 className="font-semibold text-foreground">Quick Actions</h3>
                  <div className="mt-4 space-y-3">
                    <Link href="/jobs" className="flex items-center justify-between text-sm font-medium text-foreground hover:text-primary transition-colors">
                      Browse more jobs
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Link href="/messages" className="flex items-center justify-between text-sm font-medium text-foreground hover:text-primary transition-colors">
                      Open employer messages
                      <MessageSquare className="w-4 h-4" />
                    </Link>

                  </div>
                </section>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
