'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { BarChart3, Building2, Edit2, Plus, Save, User, UserPlus, X } from 'lucide-react'
import { MetricCard, RoleShell, SectionCard } from '@/components/layout/role-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { useSession } from '@/components/layout/session-provider'
import { formatRelativeDate, shortenId } from '@/lib/display'
import { authService } from '@/services/auth.service'
import { ApiError } from '@/services/api'
import { tenantService } from '@/services/tenant.service'
import type { CreateTenantPayload, Tenant } from '@/types/user'
import { toast } from 'sonner'

const navItems = [
  { href: '/dashboard/admin', label: 'Tenants', icon: Building2, active: true },
  { href: '/dashboard/admin/analytics', label: 'Global Stats', icon: BarChart3 },
]

const INITIAL_TENANT: CreateTenantPayload = { name: '', slug: '' }

export default function AdminDashboard() {
  const { accessToken, isAuthenticated, isHydrated, user } = useSession()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [tenantForm, setTenantForm] = useState<CreateTenantPayload>(INITIAL_TENANT)
  const [adminForm, setAdminForm] = useState({
    email: '',
    password: '',
    full_name: '',
    tenant_id: '',
  })
  const [editingTenantId, setEditingTenantId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', is_active: true })
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSaving, startSaveTransition] = useTransition()

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
        if (!isMounted) {
          return
        }

        setTenants(response.tenants)
      } catch (error) {
        if (!isMounted) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : 'Unable to load tenants.')
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
    return {
      total: tenants.length,
      active: activeTenants,
      inactive: tenants.length - activeTenants,
    }
  }, [tenants])

  const handleCreateTenant = () => {
    if (!accessToken) return

    startSaveTransition(async () => {
      try {
        const nextTenant = await tenantService.create(tenantForm, accessToken)
        setTenants((current) => [nextTenant, ...current])
        setTenantForm(INITIAL_TENANT)
        toast.success('Tenant created.')
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : 'Unable to create tenant.')
      }
    })
  }

  const handleUpdateTenant = (id: string) => {
    if (!accessToken) return

    startSaveTransition(async () => {
      try {
        const updated = await tenantService.update(id, editForm, accessToken)
        setTenants((current) => current.map((t) => (t.id === id ? updated : t)))
        setEditingTenantId(null)
        toast.success('Tenant updated.')
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : 'Unable to update tenant.')
      }
    })
  }

  const handleRegisterAdmin = () => {
    if (!accessToken) {
      return
    }

    if (!adminForm.tenant_id) {
      toast.error('Please select a tenant for this admin.')
      return
    }

    startSaveTransition(async () => {
      try {
        await authService.registerAdmin(
          {
            ...adminForm,
            role: 'tenant_admin',
            tenant_id: adminForm.tenant_id,
          },
          accessToken,
        )
        setAdminForm({ email: '', password: '', full_name: '', tenant_id: '' })
        toast.success('Tenant admin account created.')
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : 'Unable to create tenant admin.')
      }
    })
  }

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
      title="Tenant Management"
      subtitle="Create organizations, manage availability, and assign tenant administrators."
      navItems={navItems}
    >
      {isLoading ? (
        <div className="flex items-center gap-3 text-secondary">
          <Spinner className="size-5" />
          Loading tenant data
        </div>
      ) : errorMessage ? (
        <div className="text-destructive font-medium">{errorMessage}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <MetricCard label="Total tenants" value={String(metrics.total)} />
            <MetricCard label="Active" value={String(metrics.active)} tone="success" />
            <MetricCard label="Inactive" value={String(metrics.inactive)} tone="warning" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <SectionCard title="Create Tenant" description="Provision a new organization workspace.">
              <div className="grid gap-5">
                <div className="space-y-2">
                  <Label htmlFor="tenant-name">Company Name</Label>
                  <Input id="tenant-name" value={tenantForm.name} onChange={(event) => setTenantForm((current) => ({ ...current, name: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenant-slug">Tenant Slug</Label>
                  <Input id="tenant-slug" value={tenantForm.slug ?? ''} onChange={(event) => setTenantForm((current) => ({ ...current, slug: event.target.value }))} />
                </div>
                <div className="flex justify-end">
                  <Button type="button" className="rounded-none gap-2" onClick={handleCreateTenant} disabled={isSaving}>
                    {isSaving ? <Spinner className="size-4" /> : <Plus className="w-4 h-4" />}
                    Provision Tenant
                  </Button>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Register Tenant Admin" description="Create an administrator account and link it to an organization.">
              <div className="grid gap-5">
                <div className="space-y-2">
                  <Label htmlFor="admin-tenant">Target Organization</Label>
                  <select
                    id="admin-tenant"
                    value={adminForm.tenant_id}
                    onChange={(e) => setAdminForm((c) => ({ ...c, tenant_id: e.target.value }))}
                    className="w-full border-2 border-primary bg-background px-3 py-2 text-sm focus:outline-none focus:ring-0"
                  >
                    <option value="">Select a tenant...</option>
                    {tenants.filter(t => t.is_active).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.slug})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-full-name">Full Name</Label>
                  <Input id="admin-full-name" value={adminForm.full_name} onChange={(event) => setAdminForm((current) => ({ ...current, full_name: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input id="admin-email" value={adminForm.email} onChange={(event) => setAdminForm((current) => ({ ...current, email: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input id="admin-password" type="password" value={adminForm.password} onChange={(event) => setAdminForm((current) => ({ ...current, password: event.target.value }))} />
                </div>
                <div className="flex justify-end">
                  <Button type="button" variant="outline" className="rounded-none gap-2 hover:bg-primary hover:text-white" onClick={handleRegisterAdmin} disabled={isSaving}>
                    {isSaving ? <Spinner className="size-4" /> : <UserPlus className="w-4 h-4" />}
                    Create Admin User
                  </Button>
                </div>
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Tenant Directory" description="Current organization records from the backend.">
            <div className="space-y-4">
              {tenants.length ? (
                tenants.map((tenant) => (
                  <div key={tenant.id} className="border-2 border-primary bg-card p-5 shadow-[4px_4px_0_0_#0F172A]">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {editingTenantId === tenant.id ? (
                        <div className="flex-1 grid gap-4 md:grid-cols-[1fr_auto_auto]">
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm((c) => ({ ...c, name: e.target.value }))}
                            className="bg-background"
                          />
                          <div className="flex items-center gap-2 px-3 border-2 border-primary bg-background">
                            <input
                              id={`active-${tenant.id}`}
                              type="checkbox"
                              checked={editForm.is_active}
                              onChange={(e) => setEditForm((c) => ({ ...c, is_active: e.target.checked }))}
                              className="accent-primary size-4"
                            />
                            <Label htmlFor={`active-${tenant.id}`} className="text-xs uppercase font-bold">Active</Label>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="rounded-none" onClick={() => handleUpdateTenant(tenant.id)} disabled={isSaving}>
                              <Save className="size-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="rounded-none" onClick={() => setEditingTenantId(null)}>
                              <X className="size-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            <p className="text-xs uppercase tracking-[0.2em] text-secondary">{tenant.slug}</p>
                            <h3 className="font-heading text-xl font-bold text-primary mt-2">{tenant.name}</h3>
                            <p className="text-sm text-muted-foreground mt-3">
                              Tenant ID {shortenId(tenant.id, 12)} · created {formatRelativeDate(tenant.created_at)}
                            </p>

                            {tenant.tenant_admin && (
                              <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                                <div className="p-2 bg-primary/5 rounded-none border border-primary/20">
                                  <User className="size-4 text-primary" />
                                </div>
                                <div className="text-sm">
                                  <p className="font-bold text-primary uppercase tracking-wider text-[0.65rem]">Organization Admin</p>
                                  <p className="font-medium text-foreground">{tenant.tenant_admin.full_name}</p>
                                  <p className="text-xs text-secondary">{tenant.tenant_admin.email}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-xs uppercase tracking-[0.2em] px-3 py-2 border-2 font-bold ${tenant.is_active ? 'border-chart-2 text-chart-2' : 'border-chart-3 text-chart-3'}`}>
                              {tenant.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-primary hover:text-white rounded-none border-2 border-transparent hover:border-primary transition-all"
                              onClick={() => {
                                setEditingTenantId(tenant.id)
                                setEditForm({ name: tenant.name, is_active: tenant.is_active })
                              }}
                            >
                              <Edit2 className="size-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-secondary">No tenants found.</p>
              )}
            </div>
          </SectionCard>
        </>
      )}
    </RoleShell>
  )
}
