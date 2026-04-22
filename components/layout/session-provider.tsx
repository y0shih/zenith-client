'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { authService } from '@/services/auth.service'
import { api, type SessionFailureReason } from '@/services/api'
import { toast } from 'sonner'
import type { AuthTokens, LoginResponseData, RefreshResponseData } from '@/types/auth'
import type { AuthUser, UserRole } from '@/types/user'

const STORAGE_KEY = 'zenith.session.v1'

type StoredSession = {
  user: AuthUser
  tokens: AuthTokens
  expires_at: number
  active_tenant_id: string | null
  active_tenant_name: string | null
}

type SessionContextValue = {
  isHydrated: boolean
  isAuthenticated: boolean
  user: AuthUser | null
  tokens: AuthTokens | null
  accessToken: string | null
  refreshToken: string | null
  activeTenantId: string | null
  activeTenantName: string | null
  setSession: (payload: LoginResponseData & { activeTenantId?: string | null; activeTenantName?: string | null }) => void
  updateUser: (user: AuthUser) => void
  setActiveTenantId: (tenantId: string | null) => void
  refreshSession: () => Promise<void>
  clearSession: () => Promise<void>
  hasRole: (...roles: UserRole[]) => boolean
}

const SessionContext = createContext<SessionContextValue | null>(null)

function computeExpiresAt(tokens: AuthTokens) {
  return Date.now() + tokens.expires_in * 1000
}

function readStoredSession(): StoredSession | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as StoredSession
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

function writeStoredSession(session: StoredSession | null) {
  if (typeof window === 'undefined') {
    return
  }

  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY)
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [storedSession, setStoredSession] = useState<StoredSession | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const refreshInFlight = useRef<Promise<void> | null>(null)

  const commitSession = (payload: {
    user: AuthUser
    tokens: AuthTokens
    activeTenantId?: string | null
    activeTenantName?: string | null
  }) => {
    const nextSession: StoredSession = {
      user: payload.user,
      tokens: payload.tokens,
      expires_at: computeExpiresAt(payload.tokens),
      active_tenant_id: payload.activeTenantId ?? null,
      active_tenant_name: payload.activeTenantName ?? null,
    }

    setStoredSession(nextSession)
    writeStoredSession(nextSession)
  }

  const refreshSession = async () => {
    if (refreshInFlight.current) {
      return refreshInFlight.current
    }

    const currentSession = readStoredSession() ?? storedSession
    if (!currentSession?.tokens.refresh_token) {
      setStoredSession(null)
      writeStoredSession(null)
      return
    }

    refreshInFlight.current = (async () => {
      try {
        const response = await authService.refreshToken(
          currentSession.tokens.refresh_token,
          currentSession.active_tenant_id
        )
        const data: RefreshResponseData =
          'tokens' in response ? response : { tokens: response, user: currentSession.user }

        commitSession({
          user: data.user ?? currentSession.user,
          tokens: data.tokens,
          activeTenantId: currentSession.active_tenant_id,
          activeTenantName: currentSession.active_tenant_name,
        })
      } catch {
        setStoredSession(null)
        writeStoredSession(null)
      } finally {
        refreshInFlight.current = null
      }
    })()

    return refreshInFlight.current
  }

  const clearSession = async () => {
    const currentSession = readStoredSession() ?? storedSession
    const refreshToken = currentSession?.tokens.refresh_token

    setStoredSession(null)
    writeStoredSession(null)

    if (!refreshToken) {
      return
    }

    try {
      await authService.logout(refreshToken)
    } catch {
      // Treat logout as best-effort. Local state is already cleared.
    }
  }

  useEffect(() => {
    const session = readStoredSession()
    setStoredSession(session)
    setIsHydrated(true)

    if (!session) {
      return
    }

    const refreshThreshold = 60 * 1000
    if (session.expires_at <= Date.now() + refreshThreshold) {
      void refreshSession()
    }
  }, [])

  useEffect(() => {
    if (!storedSession?.tokens.access_token || !storedSession.active_tenant_id || storedSession.active_tenant_name) {
      return
    }

    let isMounted = true

    async function fetchTenantName() {
      try {
        const tenants = await authService.getMyTenants(storedSession?.tokens.access_token)
        const current = tenants.find((t) => t.id === storedSession?.active_tenant_id)
        
        if (current && isMounted) {
          const nextSession: StoredSession = {
            ...storedSession!,
            active_tenant_name: current.name,
          }
          setStoredSession(nextSession)
          writeStoredSession(nextSession)
        }
      } catch {
        // Silently fail, we'll just keep showing the ID
      }
    }

    void fetchTenantName()

    return () => {
      isMounted = false
    }
  }, [storedSession?.tokens.access_token, storedSession?.active_tenant_id, storedSession?.active_tenant_name])

  useEffect(() => {
    const unbind = api.onSessionFailure((reason) => {
      setStoredSession(null)
      writeStoredSession(null)

      const message =
        reason === 'tenant_required'
          ? 'Tenant context required. Please select a tenant.'
          : 'Session expired. Please log in again.'

      toast.error(message, { id: 'session-failure' })

      // Force a full page reload/redirect to ensure all state is reset
      window.location.href = '/login'
    })

    return unbind
  }, [])

  const value = useMemo<SessionContextValue>(() => {
    const user = storedSession?.user ?? null
    const tokens = storedSession?.tokens ?? null
    const activeTenantId = storedSession?.active_tenant_id ?? null
    const activeTenantName = storedSession?.active_tenant_name ?? null

    return {
      isHydrated,
      isAuthenticated: Boolean(user && tokens?.access_token),
      user,
      tokens,
      accessToken: tokens?.access_token ?? null,
      refreshToken: tokens?.refresh_token ?? null,
      activeTenantId,
      activeTenantName,
      setSession: (payload) => {
        commitSession({
          user: payload.user,
          tokens: payload.tokens,
          activeTenantId: payload.activeTenantId,
          activeTenantName: payload.activeTenantName,
        })
      },
      updateUser: (nextUser) => {
        if (!storedSession) {
          return
        }

        const nextSession: StoredSession = {
          ...storedSession,
          user: nextUser,
          active_tenant_id: storedSession.active_tenant_id,
        }

        setStoredSession(nextSession)
        writeStoredSession(nextSession)
      },
      setActiveTenantId: (tenantId) => {
        if (!storedSession) {
          return
        }

        const nextSession: StoredSession = {
          ...storedSession,
          active_tenant_id: tenantId,
          active_tenant_name: null, // Clear name so it re-fetches for the new tenant
        }

        setStoredSession(nextSession)
        writeStoredSession(nextSession)
      },
      refreshSession,
      clearSession,
      hasRole: (...roles) => Boolean(user && roles.includes(user.role)),
    }
  }, [isHydrated, storedSession])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error('useSession must be used within SessionProvider')
  }

  return context
}
