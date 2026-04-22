'use client'

import { useEffect, useState, useTransition } from 'react'
import { Plus, ShieldCheck, User, UserPlus, X, Eye, Info, Phone, Trash2 } from 'lucide-react'
import { RoleShell, SectionCard } from '@/components/layout/role-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useSession } from '@/components/layout/session-provider'
import { shortenId } from '@/lib/display'
import { authService } from '@/services/auth.service'
import { profileService } from '@/services/profile.service'
import { ApiError } from '@/services/api'
import type { EmployerProfile } from '@/types/user'
import { toast } from 'sonner'
import type { NavItem } from '@/components/layout/role-shell'
import { usePathname } from 'next/navigation'
import { getEmployerNavItems, getEmployerRoleLabel } from '@/lib/nav'


export default function TeamManagementPage() {
  const pathname = usePathname()
  const { accessToken, activeTenantId, activeTenantName, isAuthenticated, isHydrated, user } = useSession()
  const [employers, setEmployers] = useState<EmployerProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, startSaveTransition] = useTransition()
  
  const [form, setForm] = useState({
    email: '',
    full_name: '',
    password: '',
  })
  const [selectedEmployer, setSelectedEmployer] = useState<EmployerProfile | null>(null)

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !accessToken || user?.role !== 'tenant_admin' || !activeTenantId) {
      setIsLoading(false)
      return
    }

    let isMounted = true

    async function loadTeam() {
      setIsLoading(true)
      try {
        const response = await profileService.listEmployers(accessToken as string, { page: 1, per_page: 50 })
        if (isMounted) {
          setEmployers(response.employers || [])
        }
      } catch (error) {
        toast.error('Failed to load team members.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadTeam()
    return () => { isMounted = false }
  }, [accessToken, activeTenantId, isAuthenticated, isHydrated, user?.role])

  const handleRegisterEmployer = () => {
    if (!accessToken || !activeTenantId) return

    if (!form.email || !form.full_name || !form.password) {
      toast.error('Please fill in all fields.')
      return
    }

    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }

    startSaveTransition(async () => {
      try {
        await authService.register({
          ...form,
          role: 'employer',
          tenant_id: activeTenantId
        })
        
        toast.success('Employer account created.')
        setForm({ email: '', full_name: '', password: '' })
        
        // Refresh list
        const response = await profileService.listEmployers(accessToken as string, { page: 1, per_page: 50 })
        setEmployers(response.employers || [])
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : 'Failed to create employer.')
      }
    })
  }

  const handleDeleteEmployer = (empId: string) => {
    if (!accessToken) return
    if (!window.confirm('Are you sure you want to remove this employer? This action cannot be undone.')) return

    startSaveTransition(async () => {
      try {
        await profileService.deleteEmployer(empId, accessToken as string)
        toast.success('Employer removed successfully.')
        setEmployers(prev => prev.filter(e => e.user_id !== empId))
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : 'Failed to delete employer.')
      }
    })
  }

  if (!isHydrated) return null

  if (user?.role !== 'tenant_admin') {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="font-heading text-4xl font-bold text-primary">Access Denied</h1>
          <p className="text-secondary">This page is reserved for organization administrators.</p>
        </div>
      </main>
    )
  }

  return (
    <RoleShell
      roleLabel={getEmployerRoleLabel(user?.role)}
      orgLabel={activeTenantName || `Organization ${shortenId(activeTenantId ?? '', 8)}`}
      title="Team Management"
      subtitle="Invite and manage employer accounts for your organization."
      navItems={getEmployerNavItems(pathname, user?.role)}
    >
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
        <SectionCard title="Employer Directory" description="All active recruiters in your organization.">
          {isLoading ? (
            <div className="flex items-center gap-3 py-10">
              <Spinner className="size-5" />
              <span>Loading team...</span>
            </div>
          ) : (employers?.length ?? 0) > 0 ? (
            <div className="grid gap-4">
              {employers.map((emp) => (
                <div key={emp.user_id} className="border-2 border-primary p-4 bg-card shadow-[4px_4px_0_0_#0F172A] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-10 bg-primary/10 flex items-center justify-center border border-primary/20">
                      <User className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-primary">{emp.full_name || 'Anonymous'}</p>
                      <p className="text-xs text-secondary">{emp.job_title || 'Organization Recruiter'}</p>
                      {emp.email && <p className="text-xs text-primary/70 mt-0.5">{emp.email}</p>}
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-secondary tracking-widest">Role</p>
                      <p className="text-xs font-bold text-primary">Employer</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-none border-primary text-primary hover:bg-primary/10" onClick={() => setSelectedEmployer(emp)}>
                        <Eye className="size-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-none border-red-500 text-red-500 hover:bg-red-500/10" onClick={() => handleDeleteEmployer(emp.user_id)} disabled={isSaving}>
                        <Trash2 className="size-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary py-10">No employers found in this organization.</p>
          )}
        </SectionCard>

        <div className="space-y-8">
          <SectionCard title="Add Recruiter" description="Create a new employer account linked to this organization.">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Initial Password</Label>
                <Input id="password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <Button onClick={handleRegisterEmployer} disabled={isSaving} className="rounded-none mt-2">
                {isSaving ? <Spinner className="size-4 mr-2" /> : <UserPlus className="size-4 mr-2" />}
                Register Employer
              </Button>
            </div>
          </SectionCard>
          
          <div className="p-6 border-2 border-primary bg-primary/5 shadow-[4px_4px_0_0_#0F172A]">
            <h4 className="font-bold text-primary uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
              <ShieldCheck className="size-4" />
              Admin Hint
            </h4>
            <p className="text-xs text-secondary leading-relaxed">
              Employers can post jobs and review applications, but cannot manage other team members or approve organization-wide job postings.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedEmployer} onOpenChange={(open) => !open && setSelectedEmployer(null)}>
        <DialogContent className="sm:max-w-md border-2 border-primary bg-card rounded-none shadow-[4px_4px_0_0_#0F172A]">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold flex items-center gap-3">
              <div className="size-10 bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                <User className="size-5 text-primary" />
              </div>
              <div className="text-left leading-tight">
                <p>{selectedEmployer?.full_name || 'Anonymous'}</p>
                <p className="text-sm font-normal text-secondary mt-1">{selectedEmployer?.job_title || 'Organization Recruiter'}</p>
                {selectedEmployer?.email && <p className="text-sm font-normal text-primary/80 mt-0.5">{selectedEmployer.email}</p>}
              </div>
            </DialogTitle>
            <DialogDescription className="sr-only">Employer profile details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 mt-2">
            <div className="grid grid-cols-4 items-start gap-4 text-sm border-b-2 border-primary/10 pb-4">
              <span className="font-bold uppercase tracking-widest text-[10px] text-secondary col-span-1 flex items-center gap-1.5"><Info className="size-3" /> Bio</span>
              <span className="col-span-3 text-foreground whitespace-pre-wrap">{selectedEmployer?.bio || 'No bio provided.'}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 text-sm">
              <span className="font-bold uppercase tracking-widest text-[10px] text-secondary col-span-1 flex items-center gap-1.5"><Phone className="size-3" /> Phone</span>
              <span className="col-span-3 text-foreground">{selectedEmployer?.phone || 'Not provided'}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </RoleShell>
  )
}
