'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Building2, Lock, Mail, User } from 'lucide-react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { useSession } from '@/components/layout/session-provider'
import { getDefaultRouteForRole } from '@/lib/auth'
import { authService } from '@/services/auth.service'
import { ApiError } from '@/services/api'
import { toast } from 'sonner'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 0.03,
    scale: 1,
    transition: {
      duration: 2,
      ease: 'easeOut',
    },
  },
}

export default function RegisterPage() {
  const router = useRouter()
  const { isAuthenticated, isHydrated, user } = useSession()
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tenantId, setTenantId] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace(getDefaultRouteForRole(user?.role))
    }
  }, [isAuthenticated, isHydrated, router, user?.role])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    startTransition(async () => {
      try {
        await authService.register({
          email,
          password,
          role,
          full_name: fullName,
          tenant_id: role === 'employer' ? tenantId : undefined,
        })

        toast.success('Account created. You can sign in now.')
        router.push('/login')
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : 'Unable to create your account right now.'
        setErrorMessage(message)
      }
    })
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6 py-12 selection:bg-primary selection:text-white overflow-hidden relative">
      <motion.div
        variants={heroVariants}
        initial="initial"
        animate="animate"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span className="font-heading text-[25vw] font-black tracking-tighter uppercase whitespace-nowrap leading-none">
          Network Apex
        </span>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[540px] z-10"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <Link href="/" className="group inline-flex items-center gap-2 text-secondary hover:text-primary font-bold transition-all duration-300">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm tracking-widest uppercase">Return Home</span>
          </Link>
        </motion.div>

        <div className="bg-card border border-border p-8 md:p-12 relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-cta" />

          <motion.div variants={itemVariants} className="mb-10 text-center">
            <h1 className="font-heading text-4xl font-bold text-primary tracking-tight mb-3">
              Join Zenith
            </h1>
            <p className="text-secondary font-medium">
              Create a candidate or employer account against the live API.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-10">
            <div className="grid grid-cols-2 gap-2 bg-muted p-1 border border-border">
              <button
                type="button"
                onClick={() => setRole('candidate')}
                className={`flex items-center justify-center gap-2 py-3 px-4 transition-all duration-300 ${
                  role === 'candidate'
                    ? 'bg-card text-primary font-bold border border-border'
                    : 'text-secondary font-medium hover:text-primary'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest">Candidate</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('employer')}
                className={`flex items-center justify-center gap-2 py-3 px-4 transition-all duration-300 ${
                  role === 'employer'
                    ? 'bg-card text-primary font-bold border border-border'
                    : 'text-secondary font-medium hover:text-primary'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest">Employer</span>
              </button>
            </div>
          </motion.div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="fullname" className="font-bold text-xs uppercase tracking-widest text-secondary/70">
                Full Name
              </Label>
              <Input
                id="fullname"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder={role === 'candidate' ? 'John Doe' : 'Jane Smith'}
                className="bg-transparent border-0 border-b-2 border-muted rounded-none px-0 py-6 text-lg focus-visible:ring-0 focus-visible:border-cta transition-colors placeholder:text-muted-foreground/30"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="email" className="font-bold text-xs uppercase tracking-widest text-secondary/70">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={role === 'candidate' ? 'you@example.com' : 'jane@company.com'}
                  className="bg-transparent border-0 border-b-2 border-muted rounded-none px-0 py-6 text-lg focus-visible:ring-0 focus-visible:border-cta transition-colors placeholder:text-muted-foreground/30"
                  required
                />
                <Mail className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {role === 'employer' ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label htmlFor="tenant" className="font-bold text-xs uppercase tracking-widest text-secondary/70">
                    Tenant ID
                  </Label>
                  <Input
                    id="tenant"
                    value={tenantId}
                    onChange={(event) => setTenantId(event.target.value)}
                    placeholder="Tenant UUID assigned by a system admin"
                    className="bg-transparent border-0 border-b-2 border-muted rounded-none px-0 py-6 text-lg focus-visible:ring-0 focus-visible:border-cta transition-colors placeholder:text-muted-foreground/30"
                    required={role === 'employer'}
                  />
                  <p className="text-[10px] uppercase font-bold text-secondary/50 tracking-tighter">
                    Required for employer registration in the current backend.
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="password" className="font-bold text-xs uppercase tracking-widest text-secondary/70">
                Create Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  minLength={8}
                  className="bg-transparent border-0 border-b-2 border-muted rounded-none px-0 py-6 text-lg focus-visible:ring-0 focus-visible:border-cta transition-colors placeholder:text-muted-foreground/30"
                  required
                />
                <Lock className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
              </div>
            </motion.div>

            {errorMessage ? (
              <motion.p variants={itemVariants} className="text-sm text-destructive font-medium">
                {errorMessage}
              </motion.p>
            ) : null}

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-sm uppercase tracking-[0.2em] font-bold rounded-none bg-primary text-primary-foreground hover:bg-cta transition-all duration-300 shadow-sm"
                disabled={isPending}
              >
                {isPending ? <Spinner className="size-4" /> : null}
                Create Account
              </Button>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="mt-10 text-center text-sm text-secondary font-medium border-t border-muted pt-8">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-cta hover:underline underline-offset-4">
              Return to Login
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </main>
  )
}
