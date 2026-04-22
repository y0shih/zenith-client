'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { BarChart3, Bell, Briefcase, DollarSign, MessageSquare, Plus, Users } from 'lucide-react'
import Link from 'next/link'
import { MetricCard, RoleShell, SectionCard } from '@/components/layout/role-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from '@/components/layout/session-provider'
import { canManageTenant } from '@/lib/auth'
import { formatCurrencyRange, formatEnumLabel, formatRelativeDate, shortenId } from '@/lib/display'
import { ApiError } from '@/services/api'
import { applicationService } from '@/services/application.service'
import { jobService } from '@/services/job.service'
import type { Application, ApplicationStatus } from '@/types/application'
import type { CreateJobPayload, Job } from '@/types/job'
import { toast } from 'sonner'
import { usePathname } from 'next/navigation'
import { getEmployerNavItems, getEmployerRoleLabel } from '@/lib/nav'


const INITIAL_JOB_FORM: CreateJobPayload = {
  title: '',
  description: '',
  location: '',
  job_type: 'full_time',
  salary_min: 0,
  salary_max: 0,
}

export default function EmployerDashboard() {
  const pathname = usePathname()
  const { accessToken, activeTenantId, activeTenantName, isAuthenticated, isHydrated, user } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [jobForm, setJobForm] = useState<CreateJobPayload>(INITIAL_JOB_FORM)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSaving, startSaveTransition] = useTransition()
  const [isMutating, startMutatingTransition] = useTransition()

  const tenantRole = canManageTenant(user?.role)

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !accessToken || !tenantRole || !activeTenantId) {
      setIsLoading(false)
      return
    }

    const token = accessToken
    const tenantId = activeTenantId

    let isMounted = true

    async function loadDashboard() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const [jobsResult, applicationsResult] = await Promise.all([
          jobService.listMyJobs(token, { page: 1, per_page: 20 }),
          applicationService.listTenantApplications(token, {
            page: 1,
            per_page: 20,
          }),
        ])

        if (!isMounted) {
          return
        }

        setJobs(jobsResult.jobs)
        setApplications(applicationsResult.applications)
      } catch (error) {
        if (!isMounted) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : 'Unable to load employer data.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadDashboard()

    return () => {
      isMounted = false
    }
  }, [accessToken, activeTenantId, isAuthenticated, isHydrated, tenantRole])

  const metrics = useMemo(() => {
    const openJobs = jobs.filter((job) => job.status !== 'closed').length
    const pendingJobs = jobs.filter((job) => job.status === 'pending').length
    const interviewCount = applications.filter((application) => application.status === 'interview').length
    const activeApplicants = applications.filter((application) => application.status !== 'rejected' && application.status !== 'withdrawn').length

    return { openJobs, pendingJobs, interviewCount, activeApplicants }
  }, [applications, jobs])

  const formatDisplaySalary = (val: number | undefined) => {
    if (val === undefined || val === 0) return ''
    return new Intl.NumberFormat('en-US').format(val).replace(/,/g, '.')
  }

  const handleSalaryChange = (val: string, field: 'salary_min' | 'salary_max') => {
    const numericValue = parseInt(val.replace(/\D/g, ''), 10) || 0
    setJobForm((current) => ({ ...current, [field]: numericValue }))
  }


  const handleCreateJob = () => {
    if (!accessToken || !activeTenantId) {
      return
    }

    if (jobForm.title.length < 5) {
      toast.error('Job title must be at least 5 characters.')
      return
    }

    if (jobForm.description.length < 20) {
      toast.error('Job description must be at least 20 characters.')
      return
    }

    startSaveTransition(async () => {
      try {
        const nextJob = await jobService.create(jobForm, accessToken)
        setJobs((current) => [nextJob, ...current])
        setJobForm(INITIAL_JOB_FORM)
        toast.success('Job created.')
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : 'Unable to create this job.')
      }
    })
  }

  const handleJobAction = (jobId: string, action: 'close' | 'delete') => {
    if (!accessToken || !activeTenantId) {
      return
    }

    startMutatingTransition(async () => {
      try {
        if (action === 'close') {
          await jobService.close(jobId, accessToken)
          setJobs((current) =>
            current.map((job) => (job.id === jobId ? { ...job, status: 'closed' } : job)),
          )
          toast.success('Job closed.')
          return
        }

        await jobService.delete(jobId, accessToken)
        setJobs((current) => current.filter((job) => job.id !== jobId))
        toast.success('Job deleted.')
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : 'Unable to update this job.')
      }
    })
  }

  const handleJobStatus = (jobId: string, status: 'approved' | 'rejected') => {
    if (!accessToken) return

    startMutatingTransition(async () => {
      try {
        const updated = status === 'approved' 
          ? await jobService.approve(jobId, accessToken)
          : await jobService.reject(jobId, accessToken)
        
        setJobs((current) => current.map((j) => (j.id === jobId ? updated : j)))
        toast.success(`Job ${status}.`)
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : `Unable to ${status} job.`)
      }
    })
  }

  const handleApplicationStatus = (applicationId: string, status: ApplicationStatus) => {
    if (!accessToken || !activeTenantId) {
      return
    }

    startMutatingTransition(async () => {
      try {
        const nextApplication = await applicationService.updateStatus(
          applicationId,
          { status },
          accessToken,
        )

        setApplications((current) =>
          current.map((application) =>
            application.id === applicationId ? nextApplication : application,
          ),
        )
        toast.success('Application status updated.')
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : 'Unable to update application status.')
      }
    })
  }

  if (!isHydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center gap-3">
        <Spinner className="size-5" />
        Loading workspace
      </main>
    )
  }

  if (!isAuthenticated || !tenantRole) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="font-heading text-4xl font-bold text-primary">Employer workspace</h1>
          <p className="text-secondary">
            This route requires an employer or tenant-admin account.
          </p>
        </div>
      </main>
    )
  }

  if (!activeTenantId) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="font-heading text-4xl font-bold text-primary">Tenant required</h1>
          <p className="text-secondary">
            Your account currently has no tenant selected or your session has expired.
          </p>
        </div>
      </main>
    )
  }

  return (
    <RoleShell
      roleLabel={getEmployerRoleLabel(user?.role)}
      orgLabel={activeTenantName || `Organization ${shortenId(activeTenantId, 8)}`}
      title={user?.role === 'tenant_admin' ? 'Organization Overview' : 'Employer Workspace'}
      subtitle={user?.role === 'tenant_admin' ? 'Manage your team and review job postings.' : 'Create jobs and track applications for this tenant.'}
      navItems={getEmployerNavItems(pathname, user?.role)}
    >
      {isLoading ? (
        <div className="flex items-center gap-3 text-secondary">
          <Spinner className="size-5" />
          Loading employer data
        </div>
      ) : errorMessage ? (
        <div className="text-destructive font-medium">{errorMessage}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <MetricCard label="Open jobs" value={String(metrics.openJobs)} />
            <MetricCard label="Pending review" value={String(metrics.pendingJobs)} tone="warning" />
            <MetricCard label="Active applicants" value={String(metrics.activeApplicants)} tone="cta" />
            <MetricCard label="Interview stage" value={String(metrics.interviewCount)} tone="success" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8">
            {user?.role === 'employer' ? (
              <SectionCard title="Create Job Posting" description="List a new opportunity for potential candidates within your organization.">
                <div className="grid gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input id="job-title" value={jobForm.title} onChange={(event) => setJobForm((current) => ({ ...current, title: event.target.value }))} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="job-location">Location</Label>
                      <Input id="job-location" value={jobForm.location} onChange={(event) => setJobForm((current) => ({ ...current, location: event.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job-type">Job Type</Label>
                      <select id="job-type" value={jobForm.job_type} onChange={(event) => setJobForm((current) => ({ ...current, job_type: event.target.value as CreateJobPayload['job_type'] }))} className="w-full border border-input bg-transparent px-3 py-2 text-sm">
                        <option value="full_time">Full time</option>
                        <option value="part_time">Part time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="salary-min">Salary Min</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="salary-min"
                          className="pl-8"
                          placeholder="0"
                          value={formatDisplaySalary(jobForm.salary_min)}
                          onChange={(event) => handleSalaryChange(event.target.value, 'salary_min')}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary-max">Salary Max</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="salary-max"
                          className="pl-8"
                          placeholder="0"
                          value={formatDisplaySalary(jobForm.salary_max)}
                          onChange={(event) => handleSalaryChange(event.target.value, 'salary_max')}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="job-description">Description</Label>
                    <Textarea id="job-description" rows={6} value={jobForm.description} onChange={(event) => setJobForm((current) => ({ ...current, description: event.target.value }))} />
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" className="rounded-none gap-2" onClick={handleCreateJob} disabled={isSaving}>
                      {isSaving ? <Spinner className="size-4" /> : <Plus className="w-4 h-4" />}
                      Publish Job
                    </Button>
                  </div>
                </div>
              </SectionCard>
            ) : (
              <SectionCard title="Organization Context" description="Quick insights and management for tenant administrators.">
                <div className="grid gap-6">
                  <div className="p-6 border-2 border-primary bg-primary/5 shadow-[4px_4px_0_0_#0F172A]">
                    <h4 className="font-bold text-primary uppercase tracking-widest text-xs mb-4">Pending Actions</h4>
                    {metrics.pendingJobs > 0 ? (
                      <p className="text-secondary">
                        There are <span className="font-bold text-primary">{metrics.pendingJobs}</span> jobs awaiting your approval. 
                        Scroll down to the listings to review them.
                      </p>
                    ) : (
                      <p className="text-secondary">All jobs have been reviewed. No pending actions.</p>
                    )}
                  </div>
                  <div className="p-6 border-2 border-primary bg-background shadow-[4px_4px_0_0_#0F172A]">
                    <h4 className="font-bold text-primary uppercase tracking-widest text-xs mb-4">Team Management</h4>
                    <p className="text-secondary mb-4">Add or manage employer accounts for this organization from the Team workspace.</p>
                    <Button asChild variant="outline" className="rounded-none w-full border-2">
                      <Link href="/dashboard/employer/team">Manage Team</Link>
                    </Button>
                  </div>
                </div>
              </SectionCard>
            )}

            <SectionCard title="Recent Applications" description="Track and manage the latest candidate submissions for your tenant.">
              <div className="space-y-4">
                {applications.length ? (
                  applications.slice(0, 6).map((application) => (
                    <div key={application.id} className="border-2 border-border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-heading text-lg font-bold text-primary">{application.job_title}</h3>
                          <p className="text-secondary mt-1">{application.candidate?.full_name ?? 'Candidate record unavailable'}</p>
                        </div>
                        <select
                          value={application.status}
                          onChange={(event) => handleApplicationStatus(application.id, event.target.value as ApplicationStatus)}
                          className="border border-input bg-transparent px-3 py-2 text-sm"
                        >
                          <option value="submitted">submitted</option>
                          <option value="under_review">under_review</option>
                          <option value="shortlisted">shortlisted</option>
                          <option value="interview">interview</option>
                          <option value="offered">offered</option>
                          <option value="rejected">rejected</option>
                        </select>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3">
                        Submitted {formatRelativeDate(application.created_at)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-secondary">No tenant applications yet.</p>
                )}
              </div>
            </SectionCard>
          </div>

          <div className="mt-8">
            <SectionCard title={user?.role === 'tenant_admin' ? 'Job Approval Queue' : 'Your Job Postings'} description="Review organization job statuses and manage live postings.">
              <div className="space-y-4">
                {jobs.length ? (
                  jobs.map((job) => (
                    <div key={job.id} className="border-2 border-border p-5 bg-card">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-heading text-xl font-bold text-primary">{job.title}</h3>
                            <span className={`text-[0.65rem] uppercase tracking-widest font-bold px-2 py-1 border-2 ${
                              job.status === 'approved' ? 'border-chart-2 text-chart-2' : 
                              job.status === 'pending' ? 'border-chart-3 text-chart-3' : 
                              'border-secondary text-secondary'
                            }`}>
                              {job.status}
                            </span>
                          </div>
                          <p className="text-secondary text-sm">
                            {job.location} · {formatEnumLabel(job.job_type)} · {formatCurrencyRange(job.salary_min, job.salary_max)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Updated {formatRelativeDate(job.updated_at)}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          {user?.role === 'tenant_admin' && job.status === 'pending' && (
                            <>
                              <Button type="button" variant="default" className="rounded-none bg-chart-2 hover:bg-chart-2/90" disabled={isMutating} onClick={() => handleJobStatus(job.id, 'approved')}>
                                Approve
                              </Button>
                              <Button type="button" variant="outline" className="rounded-none text-chart-3 border-chart-3 hover:bg-chart-3 hover:text-white" disabled={isMutating} onClick={() => handleJobStatus(job.id, 'rejected')}>
                                Reject
                              </Button>
                            </>
                          )}
                          <Button type="button" variant="outline" className="rounded-none" disabled={isMutating || job.status === 'closed'} onClick={() => handleJobAction(job.id, 'close')}>
                            Close
                          </Button>
                          <Button type="button" variant="destructive" className="rounded-none" disabled={isMutating} onClick={() => handleJobAction(job.id, 'delete')}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-secondary">No jobs found for this organization.</p>
                )}
              </div>
            </SectionCard>
          </div>
        </>
      )}
    </RoleShell>
  )
}
