'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { Briefcase, MapPin, Save, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from '@/components/layout/session-provider'
import { getDefaultRouteForRole } from '@/lib/auth'
import { formatEnumLabel, formatRelativeDate } from '@/lib/display'
import { ApiError } from '@/services/api'
import { applicationService } from '@/services/application.service'
import { profileService } from '@/services/profile.service'
import type { Application } from '@/types/application'
import type { CandidateProfile, UpdateCandidateProfilePayload } from '@/types/user'
import { toast } from 'sonner'

function createEmptyProfile(): CandidateProfile {
  return {
    id: '',
    user_id: '',
    headline: '',
    bio: '',
    avatar_url: '',
    phone: '',
    resume_url: '',
    portfolio_url: '',
    skills: [],
    experience_years: 0,
    location: '',
    status: 'closed',
    created_at: '',
    updated_at: '',
  }
}

export default function ProfilePage() {
  const { accessToken, isAuthenticated, isHydrated, updateUser, user } = useSession()
  const [profile, setProfile] = useState<CandidateProfile>(createEmptyProfile())
  const [applications, setApplications] = useState<Application[]>([])
  const [skillsInput, setSkillsInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSaving, startSaveTransition] = useTransition()

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !accessToken || user?.role !== 'candidate') {
      setIsLoading(false)
      return
    }

    const token = accessToken

    let isMounted = true

    async function loadProfile() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const [profileResult, applicationResult] = await Promise.all([
          profileService.getCandidateProfile(token).catch((error) => {
            if (error instanceof ApiError && error.status === 404) {
              return createEmptyProfile()
            }
            throw error
          }),
          applicationService.getMyApplications(token),
        ])

        if (!isMounted) {
          return
        }

        setProfile(profileResult)
        setSkillsInput(profileResult.skills.join(', '))
        setApplications(applicationResult.applications)
      } catch (error) {
        if (!isMounted) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : 'Unable to load your profile.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadProfile()

    return () => {
      isMounted = false
    }
  }, [accessToken, isAuthenticated, isHydrated, user?.role])

  const profileCompletion = useMemo(() => {
    const fields = [
      profile.headline,
      profile.bio,
      profile.location,
      profile.phone,
      profile.resume_url,
      profile.portfolio_url,
      profile.skills.length ? 'skills' : '',
    ]

    const filled = fields.filter((value) => Boolean(value)).length
    return Math.round((filled / fields.length) * 100)
  }, [profile])

  const handleSave = () => {
    if (!accessToken) {
      return
    }

    startSaveTransition(async () => {
      try {
        const payload: UpdateCandidateProfilePayload = {
          headline: profile.headline || undefined,
          bio: profile.bio || undefined,
          avatar_url: profile.avatar_url || undefined,
          phone: profile.phone || undefined,
          resume_url: profile.resume_url || undefined,
          portfolio_url: profile.portfolio_url || undefined,
          skills: skillsInput
            .split(',')
            .map((skill) => skill.trim())
            .filter(Boolean),
          experience_years: profile.experience_years ?? 0,
          location: profile.location || undefined,
          status: profile.status,
        }

        const nextProfile = await profileService.updateCandidateProfile(payload, accessToken)
        setProfile(nextProfile)
        setSkillsInput(nextProfile.skills.join(', '))

        if (user) {
          updateUser({
            ...user,
            full_name: user.full_name,
          })
        }

        toast.success('Profile saved.')
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : 'Unable to save your profile.')
      }
    })
  }

  if (!isHydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center gap-3">
        <Spinner className="size-5" />
        Loading session
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="font-heading text-4xl font-bold text-primary">Your candidate workspace</h1>
          <p className="text-secondary">
            Log in to manage your candidate profile and track applications.
          </p>
          <Button asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </main>
    )
  }

  if (user?.role !== 'candidate') {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="font-heading text-4xl font-bold text-primary">Candidate profile only</h1>
          <p className="text-secondary">
            This route is reserved for candidate accounts. Your workspace lives under{' '}
            <Link href={getDefaultRouteForRole(user?.role)} className="text-cta underline underline-offset-4">
              {getDefaultRouteForRole(user?.role)}
            </Link>
            .
          </p>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center gap-3">
        <Spinner className="size-5" />
        Loading candidate profile
      </main>
    )
  }

  if (errorMessage) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="font-heading text-3xl font-bold text-primary">Could not load your profile</h1>
          <p className="text-secondary">{errorMessage}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_360px] gap-8">
        <section className="border-2 border-primary bg-card shadow-[6px_6px_0_0_#0F172A]">
          <div className="border-b-2 border-border bg-primary text-white px-8 py-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center text-xl font-bold">
                  <UserRound className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/70">Candidate Workspace</p>
                  <h1 className="font-heading text-4xl font-bold mt-2">{user.full_name}</h1>
                  <p className="text-white/80 mt-2">{profile.headline || 'Add a headline to stand out to employers.'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Profile completion</p>
                <p className="font-heading text-4xl font-bold mt-2">{profileCompletion}%</p>
              </div>
            </div>
          </div>

          <div className="p-8 grid gap-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input id="headline" value={profile.headline ?? ''} onChange={(event) => setProfile((current) => ({ ...current, headline: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={profile.location ?? ''} onChange={(event) => setProfile((current) => ({ ...current, location: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={profile.phone ?? ''} onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Years</Label>
                <Input
                  id="experience"
                  type="number"
                  min={0}
                  max={50}
                  value={profile.experience_years ?? 0}
                  onChange={(event) => setProfile((current) => ({ ...current, experience_years: Number(event.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume-url">Resume URL</Label>
                <Input id="resume-url" value={profile.resume_url ?? ''} onChange={(event) => setProfile((current) => ({ ...current, resume_url: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio-url">Portfolio URL</Label>
                <Input id="portfolio-url" value={profile.portfolio_url ?? ''} onChange={(event) => setProfile((current) => ({ ...current, portfolio_url: event.target.value }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={5} value={profile.bio ?? ''} onChange={(event) => setProfile((current) => ({ ...current, bio: event.target.value }))} />
            </div>

            <div className="grid md:grid-cols-[1fr_220px] gap-6">
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Input
                  id="skills"
                  value={skillsInput}
                  onChange={(event) => setSkillsInput(event.target.value)}
                  placeholder="Go, PostgreSQL, React"
                />
                <p className="text-sm text-secondary">Comma-separated. This maps directly to the backend `skills` array.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Availability</Label>
                <select
                  id="status"
                  value={profile.status}
                  onChange={(event) => setProfile((current) => ({ ...current, status: event.target.value as CandidateProfile['status'] }))}
                  className="w-full border border-input bg-transparent px-3 py-2 text-sm"
                >
                  <option value="looking_for_work">Looking for work</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button" className="rounded-none gap-2" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Spinner className="size-4" /> : <Save className="w-4 h-4" />}
                Save Profile
              </Button>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="border-2 border-primary bg-card shadow-[6px_6px_0_0_#0F172A]">
            <div className="border-b-2 border-border px-6 py-5">
              <h2 className="font-heading text-2xl font-bold text-primary">Application Progress</h2>
              <p className="text-secondary mt-1">Live data from `/my-applications`.</p>
            </div>
            <div className="p-6 space-y-4">
              {applications.length ? (
                applications.map((application) => (
                  <div key={application.id} className="border border-border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-primary">{application.job_title}</h3>
                        <p className="text-sm text-secondary mt-1">Tenant {application.tenant_id.slice(0, 8)}</p>
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 border border-primary text-primary font-bold">
                        {formatEnumLabel(application.status)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      Submitted {formatRelativeDate(application.created_at)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-sm text-secondary">
                  No applications yet. Browse live roles from{' '}
                  <Link href="/jobs" className="text-cta underline underline-offset-4">
                    the job board
                  </Link>
                  .
                </div>
              )}
            </div>
          </section>

          <section className="border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-primary">Profile Signals</h2>
            </div>
            <div className="space-y-3 text-sm text-secondary">
              <p>Status: <span className="font-semibold text-primary capitalize">{formatEnumLabel(profile.status)}</span></p>
              <p>Last updated: {profile.updated_at ? formatRelativeDate(profile.updated_at) : 'Not saved yet'}</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {profile.location || 'Location not set'}</p>
            </div>
          </section>
        </aside>
      </div>
    </main>
  )
}
