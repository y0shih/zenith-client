'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, BriefcaseBusiness, LogIn, Settings, ShieldCheck, UserRound, UserPlus } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { useSession } from './session-provider'
import { canManageTenant, getDefaultRouteForRole, getInitials } from '@/lib/auth'

const AUTH_PATHS = new Set(['/login', '/register'])

export function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const {
    clearSession,
    isAuthenticated,
    isHydrated,
    user,
  } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = getInitials(user?.full_name)
  const dashboardLink = getDefaultRouteForRole(user?.role)

  const navItems = useMemo(() => {
    const items = [{ href: '/jobs', label: 'Jobs' }]

    if (isAuthenticated && user?.role === 'candidate') {
      items.push({ href: '/profile', label: 'Profile' })
    }

    if (canManageTenant(user?.role)) {
      items.push({ href: '/dashboard/employer', label: 'Employer' })
    }

    if (user?.role === 'system_admin') {
      items.push({ href: '/dashboard/admin', label: 'Admin' })
    }

    return items
  }, [isAuthenticated, user?.role])

  if (AUTH_PATHS.has(pathname)) {
    return null
  }

  const handleLogout = async () => {
    await clearSession()
    setIsUserMenuOpen(false)
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/jobs" className="flex items-center gap-2 font-bold text-xl text-primary">
          <span>Zenith</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors ${
                pathname === item.href ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isHydrated && isAuthenticated && user ? (
            <>
              <button
                className="relative p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                aria-label="Notifications"
                type="button"
              >
                <Bell className="w-5 h-5" />
              </button>

              <div className="relative" ref={userMenuRef}>
                <button
                  id="user-menu-btn"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer"
                  aria-label="User menu"
                  type="button"
                >
                  {initials}
                </button>

                {isUserMenuOpen ? (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-semibold text-sm text-foreground">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-secondary mt-2">
                        {user.role.replace('_', ' ')}
                      </p>
                    </div>
                    <Link
                      href={dashboardLink}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <BriefcaseBusiness className="w-4 h-4" />
                      Workspace
                    </Link>
                    {user.role === 'candidate' && (
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <UserRound className="w-4 h-4" />
                        Profile
                      </Link>
                    )}
                    <Link
                      href="/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={() => void handleLogout()}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors border-t border-border cursor-pointer"
                      type="button"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                href="/register"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-primary hover:bg-cta transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Register
              </Link>
            </>
          )}

          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {isMenuOpen ? (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-2 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : user?.role === 'system_admin' ? (
              <Link
                href="/dashboard/admin"
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Workspace
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
