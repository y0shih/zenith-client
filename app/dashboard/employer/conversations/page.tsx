'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { RoleShell, SectionCard } from '@/components/layout/role-shell'
import { Spinner } from '@/components/ui/spinner'
import { useSession } from '@/components/layout/session-provider'
import { canManageTenant } from '@/lib/auth'
import { getEmployerNavItems, getEmployerRoleLabel } from '@/lib/nav'
import { applicationService } from '@/services/application.service'
import type { Application } from '@/types/application'
import { shortenId, formatRelativeDate } from '@/lib/display'
import { ChatUI } from '@/components/features/chat/chat-ui'
import { MessageCircle, User } from 'lucide-react'

export default function EmployerConversationsPage() {
  const pathname = usePathname()
  const { accessToken, activeTenantId, activeTenantName, isAuthenticated, isHydrated, user } = useSession()
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  const [activeApplicationId, setActiveApplicationId] = useState<string | null>(null)

  const tenantRole = canManageTenant(user?.role)

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !accessToken || !tenantRole || !activeTenantId) {
      setIsLoading(false)
      return
    }

    let isMounted = true

    async function loadApplications() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const response = await applicationService.listTenantApplications(accessToken as string, {
          page: 1,
          per_page: 50,
        })

        if (!isMounted) return

        setApplications(response.applications)
        
        if (response.applications.length > 0 && !activeApplicationId) {
          setActiveApplicationId(response.applications[0].id)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load conversations.')
        }
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

  const activeApp = applications.find(a => a.id === activeApplicationId)

  return (
    <RoleShell
      roleLabel={getEmployerRoleLabel(user?.role)}
      orgLabel={activeTenantName || `Organization ${shortenId(activeTenantId, 8)}`}
      title="Conversations"
      subtitle="Chat with candidates regarding their applications."
      navItems={getEmployerNavItems(pathname, user?.role)}
    >
      {isLoading ? (
        <div className="flex items-center gap-3 text-secondary">
          <Spinner className="size-5" />
          Loading conversations...
        </div>
      ) : errorMessage ? (
        <div className="text-destructive font-medium">{errorMessage}</div>
      ) : applications.length === 0 ? (
        <SectionCard title="No Conversations" description="You have no active applications with chat history.">
          <div className="py-12 flex flex-col items-center justify-center text-secondary bg-card border-2 border-border">
            <MessageCircle className="size-10 mb-4 opacity-50" />
            <p>Candidates need to apply to jobs first before you can chat with them.</p>
          </div>
        </SectionCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 items-start h-[700px]">
          {/* LEFT: Conversation List */}
          <div className="h-full flex flex-col border-2 border-border bg-card shadow-[4px_4px_0_0_#0F172A] overflow-hidden">
            <div className="p-4 border-b-2 border-border bg-accent/20">
              <h2 className="font-heading font-bold text-lg text-primary">Recent Messages</h2>
            </div>
            <div className="overflow-y-auto flex-1">
              {applications.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setActiveApplicationId(app.id)}
                  className={`w-full text-left p-4 border-b-2 border-border hover:bg-muted/50 transition-colors ${
                    activeApplicationId === app.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="font-semibold text-primary truncate flex-1">
                      {app.candidate?.full_name || 'Unknown Candidate'}
                    </h3>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {formatRelativeDate(app.created_at)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-secondary truncate">
                    {app.job_title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 inline-block px-2 py-1 bg-muted rounded">
                    Status: {app.status.replace('_', ' ')}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Chat Window */}
          <div className="h-full flex flex-col border-2 border-border bg-card shadow-[4px_4px_0_0_#0F172A] overflow-hidden">
            {activeApp ? (
              <>
                <div className="p-4 border-b-2 border-border bg-primary/5 flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-primary">
                      {activeApp.candidate?.full_name || 'Candidate'}
                    </h2>
                    <p className="text-xs text-secondary">
                      Applying for <span className="font-medium text-primary">{activeApp.job_title}</span>
                    </p>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ChatUI applicationId={activeApp.id} />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      )}
    </RoleShell>
  )
}
