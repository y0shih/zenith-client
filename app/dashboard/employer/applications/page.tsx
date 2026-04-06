'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { BarChart3, Bell, Briefcase, MessageSquare, Users } from 'lucide-react'
import { MetricCard, RoleShell, SectionCard } from '@/components/layout/role-shell'
import { Spinner } from '@/components/ui/spinner'
import { useSession } from '@/components/layout/session-provider'
import { canManageTenant } from '@/lib/auth'
import { formatEnumLabel, formatRelativeDate, shortenId } from '@/lib/display'
import { ApiError } from '@/services/api'
import { applicationService } from '@/services/application.service'
import type { Application, ApplicationStatus } from '@/types/application'
import { toast } from 'sonner'
import { usePathname } from 'next/navigation'
import { getEmployerNavItems, getEmployerRoleLabel } from '@/lib/nav'

export default function EmployerApplicationsPage() {
  const pathname = usePathname()
  const { accessToken, activeTenantId, isAuthenticated, isHydrated, user } = useSession()
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isUpdating, startUpdatingTransition] = useTransition()

  const tenantRole = canManageTenant(user?.role)

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !accessToken || !tenantRole || !activeTenantId) {
      setIsLoading(false)
      return
    }

    const token = accessToken
    const tenantId = activeTenantId
    let isMounted = true

    async function loadApplications() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const response = await applicationService.listTenantApplications(token, {
          page: 1,
          per_page: 50,
        })

        if (!isMounted) {
          return
        }

        setApplications(response.applications)
      } catch (error) {
        if (!isMounted) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : 'Unable to load tenant applications.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadApplications()

    return () => {
      isMounted = false
    }
  }, [accessToken, activeTenantId, isAuthenticated, isHydrated, tenantRole])

  const metrics = useMemo(() => {
    const submitted = applications.filter((application) => application.status === 'submitted').length
    const underReview = applications.filter((application) => application.status === 'under_review').length
    const interview = applications.filter((application) => application.status === 'interview').length
    const offered = applications.filter((application) => application.status === 'offered').length

    return { submitted, underReview, interview, offered }
  }, [applications])

  const handleStatusChange = (applicationId: string, status: ApplicationStatus) => {
    if (!accessToken || !activeTenantId) {
      return
    }

    startUpdatingTransition(async () => {
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
        Loading application queue
      </main>
    )
  }

  if (!isAuthenticated || !tenantRole || !activeTenantId) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="font-heading text-4xl font-bold text-primary">Tenant applications</h1>
          <p className="text-secondary">
            This route requires an employer or tenant-admin account with an active tenant context.
          </p>
        </div>
      </main>
    )
  }

  return (
    <RoleShell
      roleLabel={getEmployerRoleLabel(user?.role)}
      orgLabel={`Organization ${shortenId(activeTenantId, 8)}`}
      title="Tenant Application Queue"
      subtitle="Live application status management using `GET /applications` and `PUT /applications/{id}/status`."
      navItems={getEmployerNavItems(pathname, user?.role)}
    >
      {isLoading ? (
        <div className="flex items-center gap-3 text-secondary">
          <Spinner className="size-5" />
          Loading tenant applications
        </div>
      ) : errorMessage ? (
        <div className="text-destructive font-medium">{errorMessage}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <MetricCard label="Submitted" value={String(metrics.submitted)} />
            <MetricCard label="Under review" value={String(metrics.underReview)} tone="warning" />
            <MetricCard label="Interview" value={String(metrics.interview)} tone="cta" />
            <MetricCard label="Offers" value={String(metrics.offered)} tone="success" />
          </div>

          <SectionCard
            title="Candidate Pipeline"
            description="Each card is a tenant-scoped application record from the live backend."
          >
            <div className="space-y-4">
              {applications.length ? (
                applications.map((application) => (
                  <div key={application.id} className="border-2 border-border p-5 grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-4">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-primary">
                        {application.candidate?.full_name ?? 'Candidate'}
                      </h3>
                      <p className="text-secondary mt-1">{application.job_title}</p>
                      <p className="text-foreground mt-4">
                        Resume: {application.resume_url ? 'attached' : 'not provided'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Submitted {formatRelativeDate(application.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <span className="text-xs uppercase tracking-[0.2em] border-2 border-primary px-3 py-2 text-primary font-bold text-center">
                        {formatEnumLabel(application.status)}
                      </span>
                      <select
                        className="border-2 border-border bg-white px-3 py-3 text-primary font-medium"
                        value={application.status}
                        onChange={(event) => handleStatusChange(application.id, event.target.value as ApplicationStatus)}
                        disabled={isUpdating}
                      >
                        <option value="submitted">submitted</option>
                        <option value="under_review">under_review</option>
                        <option value="shortlisted">shortlisted</option>
                        <option value="interview">interview</option>
                        <option value="offered">offered</option>
                        <option value="rejected">rejected</option>
                      </select>
                      <div className="border-2 border-border px-3 py-3 text-sm text-secondary">
                        Tenant {shortenId(application.tenant_id, 8)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-secondary">No applications found for this tenant yet.</p>
              )}
            </div>
          </SectionCard>
        </>
      )}
    </RoleShell>
  )
}
