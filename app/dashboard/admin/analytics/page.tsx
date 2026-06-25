'use client'

import { useEffect, useMemo, useState } from 'react'
import { BarChart3, Building2 } from 'lucide-react'
import { MetricCard, RoleShell, SectionCard } from '@/components/layout/role-shell'
import { Spinner } from '@/components/ui/spinner'
import { useSession } from '@/components/layout/session-provider'
import { formatRelativeDate, shortenId } from '@/lib/display'
import { tenantService } from '@/services/tenant.service'
import type { Tenant } from '@/types/user'

const navItems = [
  { href: '/dashboard/admin', label: 'Tenants', icon: Building2 },
  { href: '/dashboard/admin/analytics', label: 'Global Stats', icon: BarChart3, active: true },
]

export default function AdminAnalyticsPage() {
  const { accessToken, isAuthenticated, isHydrated, user } = useSession()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !accessToken || user?.role !== 'system_admin') {
      setIsLoading(false)
      return
    }

    const token = accessToken
    let isMounted = true

    async function loadTenants() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const response = await tenantService.list(token, { page: 1, per_page: 50 })
        if (isMounted) {
          setTenants(response.tenants)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load tenant analytics.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadTenants()

    return () => {
      isMounted = false
    }
  }, [accessToken, isAuthenticated, isHydrated, user?.role])

  const metrics = useMemo(() => {
    const activeTenants = tenants.filter((tenant) => tenant.is_active).length
    const assignedAdmins = tenants.filter((tenant) => tenant.tenant_admin).length

    return {
      total: tenants.length,
      active: activeTenants,
      inactive: tenants.length - activeTenants,
      assignedAdmins,
    }
  }, [tenants])

  const recentlyCreatedTenants = useMemo(
    () =>
      [...tenants]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5),
    [tenants],
  )

  if (!isHydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center gap-3">
        <Spinner className="size-5" />
        Loading admin workspace
      </main>
    )
  }

  if (!isAuthenticated || user?.role !== 'system_admin') {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="font-heading text-4xl font-bold text-primary">System admin only</h1>
          <p className="text-secondary">
            This dashboard requires a system admin account from the live backend.
          </p>
        </div>
      </main>
    )
  }

  return (
    <RoleShell
      roleLabel="System Administrator"
      title="Global Tenant Reporting"
      subtitle="Live platform administration based on tenant records from the backend."
      navItems={navItems}
    >
      {isLoading ? (
        <div className="flex items-center gap-3 text-secondary">
          <Spinner className="size-5" />
          Loading tenant analytics
        </div>
      ) : errorMessage ? (
        <div className="text-destructive font-medium">{errorMessage}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <MetricCard label="Total tenants" value={String(metrics.total)} />
            <MetricCard label="Active tenants" value={String(metrics.active)} tone="success" />
            <MetricCard label="Inactive tenants" value={String(metrics.inactive)} tone="warning" />
            <MetricCard label="Assigned admins" value={String(metrics.assignedAdmins)} tone="cta" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <SectionCard title="Tenant Status" description="Current organization availability from tenant records.">
              <div className="space-y-4 text-secondary">
                <p>{metrics.active} tenants can currently operate in the platform.</p>
                <p>{metrics.inactive} tenants are inactive and excluded from tenant-admin assignment.</p>
                <p>{metrics.total - metrics.assignedAdmins} tenants do not have an assigned organization admin.</p>
              </div>
            </SectionCard>

            <SectionCard title="Recently Created Tenants" description="Most recent tenant records returned by the backend.">
              {recentlyCreatedTenants.length ? (
                <div className="space-y-4">
                  {recentlyCreatedTenants.map((tenant) => (
                    <div key={tenant.id} className="flex flex-col gap-1 border-b border-border pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-bold text-primary">{tenant.name}</p>
                        <span className={`text-xs uppercase tracking-[0.2em] ${tenant.is_active ? 'text-chart-2' : 'text-chart-3'}`}>
                          {tenant.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-secondary">
                        {tenant.slug} - {shortenId(tenant.id, 12)} - created {formatRelativeDate(tenant.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary">No tenants found.</p>
              )}
            </SectionCard>
          </div>
        </>
      )}
    </RoleShell>
  )
}
