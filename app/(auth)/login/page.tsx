'use client'

import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Lock, Mail, Building2, ChevronRight } from 'lucide-react'
import { motion, type Variants, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { useSession } from '@/components/layout/session-provider'
import { getDefaultRouteForRole } from '@/lib/auth'
import { authService } from '@/services/auth.service'
import { ApiError } from '@/services/api'
import { toast } from 'sonner'
import type { TenantInfo, LoginResponseData, AuthTokens } from '@/types/auth'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

const heroVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 0.03,
    scale: 1,
    transition: {
      duration: 2,
      ease: 'easeOut',
    },
  },
}

type LoginStep = 'credentials' | 'tenant_selection'

function requiresTenantSelection(role: string | null | undefined) {
  return role === 'employer' || role === 'tenant_admin' || role === 'user'
}

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, isHydrated, setSession, user, activeTenantId } = useSession()
  
  const [step, setStep] = useState<LoginStep>('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  
  const [baseSession, setBaseSession] = useState<LoginResponseData | null>(null)
  const [tenants, setTenants] = useState<TenantInfo[]>([])

  useEffect(() => {
    if (isHydrated && isAuthenticated && (!requiresTenantSelection(user?.role) || activeTenantId)) {
      router.replace(getDefaultRouteForRole(user?.role))
    }
  }, [isAuthenticated, isHydrated, router, user?.role, activeTenantId])

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    startTransition(async () => {
      try {
        const session = await authService.login({ email, password })
        
        if (requiresTenantSelection(session.user.role)) {
          // Tenant-scoped accounts must exchange the login token for a tenant-aware token before entering the workspace
          const userTenants = await authService.getMyTenants(session.tokens.access_token)
          
          if (userTenants.length === 0) {
            throw new Error('This account is not associated with any organizations.')
          }

          setBaseSession(session)
          setTenants(userTenants)

          if (userTenants.length === 1) {
            handleTenantSelect(userTenants[0].id, session.tokens.access_token, session.user)
            return
          }

          setStep('tenant_selection')
          toast.success('Identity verified. Please select an organization.')
        } else {
          setSession(session)
          toast.success('Logged in successfully')
          router.push(getDefaultRouteForRole(session.user.role))
        }
      } catch (error: any) {
        const message =
          error instanceof ApiError ? error.message : error?.message || 'Unable to sign in right now.'
        setErrorMessage(message)
      }
    })
  }

  const handleTenantSelect = (tenantId: string, customToken?: string, customUser?: any) => {
    const tokenToUse = customToken || baseSession?.tokens.access_token
    const userBasis = customUser || baseSession?.user

    if (!tokenToUse || !userBasis) return

    startTransition(async () => {
      try {
        const tenantTokens = await authService.selectTenant(tenantId, tokenToUse)

        let updatedRole = userBasis.role
        try {
          const payload = JSON.parse(atob(tenantTokens.access_token.split('.')[1]))
          if (payload.role) {
            updatedRole = payload.role
          }
        } catch (e) {
          console.error('Failed to parse JWT payload', e)
        }

        const userToCommit = { ...userBasis, role: updatedRole }

        setSession({ tokens: tenantTokens, user: userToCommit, activeTenantId: tenantId })
        toast.success('Organization selected')
        router.push(getDefaultRouteForRole(userToCommit.role))
      } catch (error: any) {
        console.error('Tenant selection failed:', error)
        const message =
          error instanceof ApiError
            ? error.message
            : error?.message || 'Failed to select organization.'
        setErrorMessage(message)
      }
    })
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6 selection:bg-primary selection:text-white overflow-hidden relative">
      <motion.div
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span className="font-heading text-[25vw] font-black tracking-tighter uppercase whitespace-nowrap leading-none">
          Zenith Apex
        </span>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[480px] z-10"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <Link href="/" className="group inline-flex items-center gap-2 text-secondary hover:text-primary font-bold transition-all duration-300">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm tracking-widest uppercase">Return Home</span>
          </Link>
        </motion.div>

        <div className="bg-card border border-border p-8 md:p-12 relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-cta" />

          <AnimatePresence mode="wait">
            {step === 'credentials' ? (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10 text-center">
                  <h1 className="font-heading text-4xl font-bold text-primary tracking-tight mb-3">
                    Welcome back
                  </h1>
                  <p className="text-secondary font-medium">
                    Sign in to access live jobs, applications, and tenant tools.
                  </p>
                </div>

                <form className="space-y-8" onSubmit={handleLoginSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold text-xs uppercase tracking-widest text-secondary/70">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="name@zenith.com"
                        className="bg-transparent border-0 border-b-2 border-muted rounded-none px-0 py-6 text-lg focus-visible:ring-0 focus-visible:border-cta transition-colors placeholder:text-muted-foreground/30"
                        required
                      />
                      <Mail className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-bold text-xs uppercase tracking-widest text-secondary/70">
                      Secure Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="••••••••"
                        className="bg-transparent border-0 border-b-2 border-muted rounded-none px-0 py-6 text-lg focus-visible:ring-0 focus-visible:border-cta transition-colors placeholder:text-muted-foreground/30"
                        required
                      />
                      <Lock className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                    </div>
                  </div>

                  {errorMessage ? (
                    <p className="text-sm text-destructive font-medium">
                      {errorMessage}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-sm uppercase tracking-[0.2em] font-bold rounded-none bg-primary text-primary-foreground hover:bg-cta transition-all duration-300 shadow-sm"
                    disabled={isPending}
                  >
                    {isPending ? <Spinner className="size-4 mr-2" /> : null}
                    Access Account
                  </Button>
                </form>

                <p className="mt-10 text-center text-sm text-secondary font-medium border-t border-muted pt-8">
                  Do not have an account?{' '}
                  <Link href="/register" className="font-bold text-cta hover:underline underline-offset-4">
                    Create one
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="tenant_selection"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10 text-center">
                  <h1 className="font-heading text-3xl font-bold text-primary tracking-tight mb-3">
                    Select Organization
                  </h1>
                  <p className="text-secondary font-medium">
                    You are associated with multiple organizations.
                  </p>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {tenants.map((tenant) => (
                    <button
                      key={tenant.id}
                      onClick={() => handleTenantSelect(tenant.id)}
                      disabled={isPending}
                      className="w-full flex items-center justify-between p-5 border-2 border-muted hover:border-cta hover:bg-cta/5 transition-all text-left group disabled:opacity-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted group-hover:bg-cta/10 transition-colors">
                          <Building2 className="w-5 h-5 text-secondary group-hover:text-cta" />
                        </div>
                        <div>
                          <p className="font-bold text-primary group-hover:text-cta">{tenant.name}</p>
                          <p className="text-xs text-secondary/60 uppercase tracking-widest">{tenant.slug}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-cta transition-transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>

                {errorMessage ? (
                  <p className="text-sm text-destructive font-medium mt-6">
                    {errorMessage}
                  </p>
                ) : null}

                <div className="mt-8 pt-8 border-t border-muted">
                  <button
                    onClick={() => {
                      setStep('credentials')
                      setErrorMessage(null)
                    }}
                    className="w-full py-2 text-xs uppercase tracking-widest font-bold text-secondary hover:text-primary transition-colors"
                  >
                    Back to login
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  )
}
