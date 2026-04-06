'use client'

import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'
import { Bell, Save, Settings, Shield, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from '@/components/layout/session-provider'
import { formatEnumLabel } from '@/lib/display'
import { ApiError } from '@/services/api'
import { profileService } from '@/services/profile.service'
import type {
  CandidateProfile,
  EmployerProfile,
  UpdateCandidateProfilePayload,
  UpdateEmployerProfilePayload,
} from '@/types/user'
import { toast } from 'sonner'

type SettingsSection = 'profile' | 'account' | 'notifications' | 'security'

const SECTION_CONFIG: Record<SettingsSection, { label: string; icon: typeof UserRound }> = {
  profile: { label: 'Profile', icon: UserRound },
  account: { label: 'Account', icon: Settings },
  notifications: { label: 'Notifications', icon: Bell },
  security: { label: 'Security', icon: Shield },
}

const EMPTY_CANDIDATE: CandidateProfile = {
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

const EMPTY_EMPLOYER: EmployerProfile = {
  id: '',
  user_id: '',
  job_title: '',
  bio: '',
  avatar_url: '',
  phone: '',
  created_at: '',
  updated_at: '',
}

export default function SettingsPage() {
  const { accessToken, activeTenantId, clearSession, isAuthenticated, isHydrated, user } = useSession()
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(EMPTY_CANDIDATE)
  const [employerProfile, setEmployerProfile] = useState<EmployerProfile>(EMPTY_EMPLOYER)
  const [skillsInput, setSkillsInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSaving, startSaveTransition] = useTransition()

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !accessToken || !user) {
      setIsLoading(false)
      return
    }

    const token = accessToken
    const currentUser = user

    let isMounted = true

    async function loadSettingsProfile() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        if (currentUser.role === 'candidate') {
          const nextProfile = await profileService.getCandidateProfile(token).catch((error) => {
            if (error instanceof ApiError && error.status === 404) {
              return EMPTY_CANDIDATE
            }
            throw error
          })

          if (!isMounted) {
            return
          }

          setCandidateProfile(nextProfile)
          setSkillsInput(nextProfile.skills.join(', '))
        } else if (currentUser.role === 'employer' || currentUser.role === 'tenant_admin') {
          const nextProfile = await profileService.getEmployerProfile(token).catch((error) => {
            if (error instanceof ApiError && error.status === 404) {
              return EMPTY_EMPLOYER
            }
            throw error
          })

          if (!isMounted) {
            return
          }

          setEmployerProfile(nextProfile)
        }
      } catch (error) {
        if (!isMounted) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : 'Unable to load settings.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadSettingsProfile()

    return () => {
      isMounted = false
    }
  }, [accessToken, isAuthenticated, isHydrated, user])

  const handleSaveProfile = () => {
    if (!accessToken || !user) {
      return
    }

    startSaveTransition(async () => {
      try {
        if (user.role === 'candidate') {
          const payload: UpdateCandidateProfilePayload = {
            headline: candidateProfile.headline || undefined,
            bio: candidateProfile.bio || undefined,
            avatar_url: candidateProfile.avatar_url || undefined,
            phone: candidateProfile.phone || undefined,
            resume_url: candidateProfile.resume_url || undefined,
            portfolio_url: candidateProfile.portfolio_url || undefined,
            skills: skillsInput.split(',').map((skill) => skill.trim()).filter(Boolean),
            experience_years: candidateProfile.experience_years ?? 0,
            location: candidateProfile.location || undefined,
            status: candidateProfile.status,
          }

          const nextProfile = await profileService.updateCandidateProfile(payload, accessToken)
          setCandidateProfile(nextProfile)
          setSkillsInput(nextProfile.skills.join(', '))
        } else if (user.role === 'employer' || user.role === 'tenant_admin') {
          const payload: UpdateEmployerProfilePayload = {
            job_title: employerProfile.job_title || undefined,
            bio: employerProfile.bio || undefined,
            avatar_url: employerProfile.avatar_url || undefined,
            phone: employerProfile.phone || undefined,
          }

          const nextProfile = await profileService.updateEmployerProfile(payload, accessToken)
          setEmployerProfile(nextProfile)
        }

        toast.success('Settings saved.')
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : 'Unable to save settings.')
      }
    })
  }

  const handleSignOut = async () => {
    await clearSession()
    toast.success('Signed out')
  }

  if (!isHydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center gap-3">
        <Spinner className="size-5" />
        Loading settings
      </main>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="font-heading text-4xl font-bold text-primary">Settings</h1>
          <p className="text-secondary">Log in to manage your account and profile settings.</p>
          <Button asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background flex flex-col md:flex-row">
      <aside className="w-full md:w-72 border-r border-border bg-card p-4 md:p-6 space-y-2">
        <div className="mb-8 px-2">
          <h1 className="font-heading text-xl font-bold text-primary tracking-tight">Settings</h1>
          <p className="text-xs text-secondary font-medium uppercase tracking-widest mt-1">
            {formatEnumLabel(user.role)}
          </p>
        </div>

        <nav className="space-y-1">
          {(Object.keys(SECTION_CONFIG) as SettingsSection[]).map((key) => {
            const { label, icon: Icon } = SECTION_CONFIG[key]
            const isActive = activeSection === key
            return (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-none transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-l-2 border-cta'
                    : 'text-secondary hover:bg-muted hover:text-primary'
                }`}
                type="button"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-foreground' : 'text-secondary group-hover:text-primary'}`} />
                  <span className="text-sm font-bold tracking-tight">{label}</span>
                </div>
              </button>
            )
          })}
        </nav>

        <div className="pt-8 mt-8 border-t border-border">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-destructive hover:bg-destructive/5 transition-colors group" type="button" onClick={() => void handleSignOut()}>
            <Shield className="w-4 h-4" />
            <span className="text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-12 lg:p-16 max-w-4xl overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center gap-3">
            <Spinner className="size-5" />
            Loading settings data
          </div>
        ) : errorMessage ? (
          <div className="space-y-3">
            <h2 className="font-heading text-3xl font-bold text-primary">Could not load settings</h2>
            <p className="text-secondary">{errorMessage}</p>
          </div>
        ) : (
          <div className="space-y-10">
            <div>
              <h2 className="font-heading text-3xl font-bold text-primary tracking-tight">
                {SECTION_CONFIG[activeSection].label}
              </h2>
              <p className="text-secondary mt-2 font-medium">
                Manage your live account data and the profile fields supported by the current backend.
              </p>
            </div>

            {activeSection === 'profile' ? (
              <div className="space-y-8">
                {user.role === 'candidate' ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label htmlFor="candidate-headline">Headline</Label>
                        <Input id="candidate-headline" value={candidateProfile.headline ?? ''} onChange={(event) => setCandidateProfile((current) => ({ ...current, headline: event.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="candidate-location">Location</Label>
                        <Input id="candidate-location" value={candidateProfile.location ?? ''} onChange={(event) => setCandidateProfile((current) => ({ ...current, location: event.target.value }))} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="candidate-bio">Bio</Label>
                      <Textarea id="candidate-bio" rows={5} value={candidateProfile.bio ?? ''} onChange={(event) => setCandidateProfile((current) => ({ ...current, bio: event.target.value }))} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label htmlFor="candidate-resume">Resume URL</Label>
                        <Input id="candidate-resume" value={candidateProfile.resume_url ?? ''} onChange={(event) => setCandidateProfile((current) => ({ ...current, resume_url: event.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="candidate-portfolio">Portfolio URL</Label>
                        <Input id="candidate-portfolio" value={candidateProfile.portfolio_url ?? ''} onChange={(event) => setCandidateProfile((current) => ({ ...current, portfolio_url: event.target.value }))} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="candidate-skills">Skills</Label>
                      <Input id="candidate-skills" value={skillsInput} onChange={(event) => setSkillsInput(event.target.value)} placeholder="React, Go, PostgreSQL" />
                    </div>
                  </>
                ) : user.role === 'employer' || user.role === 'tenant_admin' ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label htmlFor="employer-title">Job Title</Label>
                        <Input id="employer-title" value={employerProfile.job_title ?? ''} onChange={(event) => setEmployerProfile((current) => ({ ...current, job_title: event.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employer-phone">Phone</Label>
                        <Input id="employer-phone" value={employerProfile.phone ?? ''} onChange={(event) => setEmployerProfile((current) => ({ ...current, phone: event.target.value }))} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employer-bio">Bio</Label>
                      <Textarea id="employer-bio" rows={5} value={employerProfile.bio ?? ''} onChange={(event) => setEmployerProfile((current) => ({ ...current, bio: event.target.value }))} />
                    </div>
                  </>
                ) : (
                  <p className="text-secondary">System admin accounts do not currently expose an editable profile endpoint.</p>
                )}

                {user.role !== 'system_admin' ? (
                  <div className="pt-6">
                    <Button className="rounded-none h-12 px-8 bg-primary hover:bg-cta transition-colors font-bold uppercase tracking-widest text-xs flex items-center gap-2" type="button" onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? <Spinner className="size-4" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : null}

            {activeSection === 'account' ? (
              <div className="space-y-6">
                <div className="p-4 bg-muted/30 border border-border">
                  <p className="text-sm font-bold text-primary">Email</p>
                  <p className="text-secondary mt-1">{user.email}</p>
                </div>
                <div className="p-4 bg-muted/30 border border-border">
                  <p className="text-sm font-bold text-primary">Role</p>
                  <p className="text-secondary mt-1 capitalize">{formatEnumLabel(user.role)}</p>
                </div>
                <div className="p-4 bg-muted/30 border border-border">
                  <p className="text-sm font-bold text-primary">Active Tenant</p>
                  <p className="text-secondary mt-1">{activeTenantId ?? 'No tenant selected'}</p>
                </div>
              </div>
            ) : null}

            {activeSection === 'notifications' ? (
              <div className="space-y-4">
                <div className="p-4 border border-border bg-card">
                  <p className="text-sm font-bold text-primary">Backend status</p>
                  <p className="text-xs text-secondary font-medium mt-1">
                    Notification preferences are not exposed by the current backend API, so this section is informational for now.
                  </p>
                </div>
              </div>
            ) : null}

            {activeSection === 'security' ? (
              <div className="space-y-4">
                <div className="p-4 border border-border bg-card">
                  <p className="text-sm font-bold text-primary">Session security</p>
                  <p className="text-xs text-secondary font-medium mt-1">
                    Authentication is backed by JWT access tokens and refresh tokens from the live backend. Password change and 2FA APIs are not yet documented.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  )
}
