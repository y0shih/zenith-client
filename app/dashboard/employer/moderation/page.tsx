'use client'

import { useEffect, useState, useTransition } from 'react'
import { Briefcase, Building, Plus, ShieldAlert, X } from 'lucide-react'
import Link from 'next/link'
import { RoleShell, SectionCard } from '@/components/layout/role-shell'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useSession } from '@/components/layout/session-provider'
import { formatCurrencyRange, formatEnumLabel, formatRelativeDate, shortenId } from '@/lib/display'
import { ApiError } from '@/services/api'
import { jobService } from '@/services/job.service'
import type { Job } from '@/types/job'
import { toast } from 'sonner'
import { usePathname } from 'next/navigation'
import { getEmployerNavItems, getEmployerRoleLabel } from '@/lib/nav'

export default function JobModerationPage() {
  const pathname = usePathname()
  const { accessToken, activeTenantId, activeTenantName, isAuthenticated, isHydrated, user } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isMutating, startMutatingTransition] = useTransition()

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !accessToken || !activeTenantId) {
      setIsLoading(false)
      return
    }

    const token = accessToken

    let isMounted = true

    async function loadJobs() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const jobsResult = await jobService.listMyJobs(token, { page: 1, per_page: 50 })
        if (isMounted) {
          setJobs(jobsResult.jobs)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load jobs for moderation.')
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadJobs()
    return () => { isMounted = false }
  }, [accessToken, activeTenantId, isAuthenticated, isHydrated])

  const handleJobAction = (jobId: string, action: 'close' | 'delete') => {
    if (!accessToken) return

    startMutatingTransition(async () => {
      try {
        if (action === 'close') {
          await jobService.close(jobId, accessToken)
          setJobs((current) => current.map((job) => (job.id === jobId ? { ...job, status: 'closed' } : job)))
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

  if (!isHydrated) return null

  if (user?.role !== 'tenant_admin' && user?.role !== 'employer') {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="font-heading text-4xl font-bold text-primary">Access Denied</h1>
          <p className="text-secondary">This page is reserved for organization members.</p>
        </div>
      </main>
    )
  }

  return (
    <RoleShell
      roleLabel={getEmployerRoleLabel(user?.role)}
      orgLabel={activeTenantName || `Organization ${shortenId(activeTenantId ?? '', 8)}`}
      title="Job Moderation"
      subtitle="Review, approve, and manage jobs posted by recruiters in your organization."
      navItems={getEmployerNavItems(pathname, user?.role)}
    >
      <div className="space-y-8">
        <SectionCard title="Organization Jobs" description="Complete list of all jobs created by your team.">
          {isLoading ? (
            <div className="flex items-center gap-3 text-secondary py-10">
              <Spinner className="size-5" />
              Loading jobs...
            </div>
          ) : errorMessage ? (
            <div className="text-destructive font-medium py-10">{errorMessage}</div>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border-2 border-primary p-5 bg-card shadow-[4px_4px_0_0_#0F172A] flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-heading text-xl font-bold text-primary leading-none">{job.title}</h3>
                      <span className={`text-[0.65rem] uppercase tracking-widest font-bold px-2 py-1 border-2 ${
                        job.status === 'approved' ? 'border-chart-2 text-chart-2 bg-chart-2/5' : 
                        job.status === 'pending' ? 'border-chart-3 text-chart-3 bg-chart-3/5' : 
                        job.status === 'rejected' ? 'border-destructive text-destructive bg-destructive/5' :
                        'border-secondary text-secondary bg-secondary/5'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-secondary tracking-widest">Posted By</p>
                        <p className="text-sm font-bold text-primary flex items-center gap-1.5 line-clamp-1">
                          {(job as any).employer_name || 'Organization Recruiter'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-secondary tracking-widest">Location</p>
                        <p className="text-sm text-foreground">{job.location || 'Remote'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-secondary tracking-widest">Type</p>
                        <p className="text-sm text-foreground">{formatEnumLabel(job.job_type)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-secondary tracking-widest">Salary</p>
                        <p className="text-sm text-foreground">{formatCurrencyRange(job.salary_min, job.salary_max)}</p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Created {formatRelativeDate(job.created_at)}
                      {job.approved_at && ` · Approved ${formatRelativeDate(job.approved_at)}`}
                    </p>
                  </div>

                  <div className="flex flex-wrap md:flex-col gap-2 shrink-0 md:min-w-[120px]">
                    <Button asChild variant="default" className="rounded-none w-full bg-primary hover:bg-primary/90 text-white">
                      <Link href={`/jobs/${job.id}`}>View</Link>
                    </Button>
                    {user?.role === 'tenant_admin' && job.status === 'pending' && (
                      <>
                        <Button type="button" className="rounded-none bg-chart-2 hover:bg-chart-2/90 w-full" disabled={isMutating} onClick={() => handleJobStatus(job.id, 'approved')}>
                          Approve
                        </Button>
                        <Button type="button" variant="outline" className="rounded-none text-chart-3 border-chart-3 hover:bg-chart-3 hover:text-white w-full" disabled={isMutating} onClick={() => handleJobStatus(job.id, 'rejected')}>
                          Reject
                        </Button>
                      </>
                    )}
                    {(user?.role === 'tenant_admin' || user?.id === job.employer_id) && (
                      <>
                        {job.status !== 'closed' && (
                          <Button type="button" variant="outline" className="rounded-none w-full border-primary text-primary hover:bg-primary/10" disabled={isMutating} onClick={() => handleJobAction(job.id, 'close')}>
                            Close
                          </Button>
                        )}
                        <Button type="button" variant="outline" className="rounded-none w-full border-destructive text-destructive hover:bg-destructive hover:text-white" disabled={isMutating} onClick={() => handleJobAction(job.id, 'delete')}>
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-border">
              <Building className="size-10 text-secondary mx-auto mb-3" />
              <h3 className="font-heading font-bold text-primary mb-1">No Jobs Found</h3>
              <p className="text-secondary text-sm">There are no job postings in your organization yet.</p>
            </div>
          )}
        </SectionCard>
      </div>
    </RoleShell>
  )
}
