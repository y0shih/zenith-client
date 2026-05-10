'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { ChevronDown, FileText, User } from 'lucide-react'
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
import { SecurePdfViewer } from '@/components/features/job/secure-pdf-viewer'

import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const getStatusTone = (status: ApplicationStatus): "neutral" | "info" | "success" | "warning" | "danger" => {
  switch (status) {
    case 'submitted': return 'neutral'
    case 'under_review': return 'warning'
    case 'shortlisted': return 'info'
    case 'interview': return 'info'
    case 'offered': return 'success'
    case 'rejected': return 'danger'
    case 'withdrawn': return 'neutral'
    default: return 'neutral'
  }
}

export default function EmployerApplicationsPage() {
  const pathname = usePathname()
  const { accessToken, activeTenantId, activeTenantName, isAuthenticated, isHydrated, user } = useSession()
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
      orgLabel={activeTenantName || `Organization ${shortenId(activeTenantId, 8)}`}
      title="Tenant Application Queue"
      subtitle="Managing your application queue"
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
                  <div key={application.id} className="border-2 border-border p-5 grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-4 items-start">
                    <div className="space-y-4">
                      <div className="flex flex-col items-start gap-1">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="link" className="p-0 h-auto font-heading text-xl font-bold text-primary hover:underline">
                              {application.candidate?.full_name ?? 'Candidate'}
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="overflow-y-auto sm:max-w-md border-l-2 border-border shadow-none">
                            <SheetHeader className="text-left space-y-1">
                              <SheetTitle className="font-heading text-2xl font-black text-primary uppercase">
                                {application.candidate?.full_name ?? 'Candidate'}
                              </SheetTitle>
                              <SheetDescription className="text-base text-secondary font-medium">
                                Position: {application.job_title}
                              </SheetDescription>
                            </SheetHeader>
                            <div className="mt-8 flex flex-col gap-6">
                              <div className="space-y-2">
                                <h4 className="font-bold text-primary uppercase tracking-wider text-sm border-b-2 border-border pb-1">
                                  Contact Information
                                </h4>
                                <p className="text-foreground">
                                  <span className="text-secondary mr-2">Email:</span>
                                  {application.candidate?.email ?? 'Not provided'}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-bold text-primary uppercase tracking-wider text-sm border-b-2 border-border pb-1">
                                  Cover Letter
                                </h4>
                                {application.cover_letter ? (
                                  <div className="bg-muted p-4 border border-border text-foreground text-sm whitespace-pre-wrap">
                                    {application.cover_letter}
                                  </div>
                                ) : (
                                  <p className="text-muted-foreground italic text-sm">No cover letter provided.</p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-bold text-primary uppercase tracking-wider text-sm border-b-2 border-border pb-1">
                                  Application Metadata
                                </h4>
                                <ul className="text-sm space-y-2 text-foreground">
                                  <li>
                                    <span className="text-secondary mr-2">Submitted:</span>
                                    {new Date(application.created_at).toLocaleDateString()}
                                  </li>
                                  <li>
                                    <span className="text-secondary mr-2">Last Update:</span>
                                    {new Date(application.updated_at).toLocaleDateString()}
                                  </li>
                                  <li>
                                    <span className="text-secondary mr-2">Status:</span>
                                    <StatusBadge tone={getStatusTone(application.status)}>{formatEnumLabel(application.status)}</StatusBadge>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                        <p className="text-secondary">{application.job_title}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        {application.resume_url ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="rounded-none border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-bold">
                                <FileText className="mr-2 size-4" />
                                View CV
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl h-[85vh] flex flex-col rounded-none border-2 border-primary shadow-xl">
                              <DialogHeader>
                                <DialogTitle className="font-heading text-2xl font-bold">Candidate CV</DialogTitle>
                              </DialogHeader>
                              <div className="flex-1 min-h-0 relative">
                                {accessToken && <SecurePdfViewer applicationId={application.id} token={accessToken} />}
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground py-1">
                            <FileText className="size-4" />
                            No CV
                          </span>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Submitted {formatRelativeDate(application.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:items-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            disabled={isUpdating}
                            className="focus:outline-none disabled:opacity-50 transition-opacity flex items-center justify-center lg:justify-end"
                          >
                            <StatusBadge tone={getStatusTone(application.status)} className="cursor-pointer hover:bg-opacity-80 py-2 px-3 text-xs w-full lg:w-auto">
                              {formatEnumLabel(application.status)}
                              <ChevronDown className="ml-1 inline size-3" />
                            </StatusBadge>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px] border-2 rounded-none p-0">
                          {(['submitted', 'under_review', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'] as ApplicationStatus[]).map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => handleStatusChange(application.id, status)}
                              disabled={isUpdating}
                              className="rounded-none cursor-pointer focus:bg-accent focus:text-accent-foreground font-medium text-sm py-2"
                            >
                              {formatEnumLabel(status)}
                              {application.status === status && <span className="ml-auto flex size-2 rounded-full bg-primary" />}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <div className="px-3 py-1.5 text-xs text-muted-foreground text-center lg:text-right w-full lg:w-auto">
                        ID: {shortenId(application.id, 8)}
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
