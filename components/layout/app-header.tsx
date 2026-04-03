'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './theme-toggle'

interface Notification {
  id: string
  type: 'application' | 'message' | 'interview' | 'update'
  title: string
  description: string
  timestamp: string
  read: boolean
}

const PREVIEW_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'application',
    title: 'Application Viewed',
    description: 'Tech Corp viewed your application for Senior Full Stack Engineer',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message',
    description: 'Sarah Chen from Tech Corp sent you a message',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'interview',
    title: 'Interview Scheduled',
    description: 'Your interview with Cloud Systems is scheduled for March 29',
    timestamp: '1 day ago',
    read: false,
  },
]

const TYPE_STYLES: Record<Notification['type'], { dot: string; icon: React.ReactNode }> = {
  application: {
    dot: 'bg-blue-500',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  message: {
    dot: 'bg-emerald-500',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  interview: {
    dot: 'bg-amber-500',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  update: {
    dot: 'bg-primary',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
}

export function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const pathname = usePathname()
  
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Hide header on auth pages - MUST BE AFTER ALL HOOKS
  if (pathname === '/login' || pathname === '/register') return null;
  const isProfilePage = pathname === '/profile'
  
  const notificationCount = PREVIEW_NOTIFICATIONS.filter((n) => !n.read).length

  return (
    <header className={`${isProfilePage ? 'relative' : 'sticky top-0 z-40'} bg-card border-b border-border`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/jobs" className="flex items-center gap-2 font-bold text-xl text-primary">
          <span className="hidden sm:inline">Zenith</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/jobs" className="text-sm text-foreground hover:text-primary transition-colors">
            Jobs
          </Link>

          <Link href="/employers" className="text-sm text-foreground hover:text-primary transition-colors">
            Employers
          </Link>
          <Link href="/messages" className="text-sm text-foreground hover:text-primary transition-colors">
            Messages
          </Link>
          <Link href="/dashboard/employer" className="text-sm text-foreground hover:text-primary transition-colors">
            Employer
          </Link>
          <Link href="/dashboard/admin" className="text-sm text-foreground hover:text-primary transition-colors">
            Admin
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              id="notif-bell-btn"
              onClick={() => {
                setIsNotifOpen((prev) => !prev)
                setIsUserMenuOpen(false)
              }}
              className="relative p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div
                id="notif-dropdown"
                className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
              >
                {/* Dropdown Header */}
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
                  {notificationCount > 0 && (
                    <span className="text-xs bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-medium px-2 py-0.5 rounded-full">
                      {notificationCount} new
                    </span>
                  )}
                </div>

                {/* Notification Items */}
                <div className="divide-y divide-border max-h-64 overflow-y-auto">
                  {PREVIEW_NOTIFICATIONS.map((notif) => (
                    <div
                      key={notif.id}
                      className={`flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50 cursor-pointer ${!notif.read ? 'bg-primary/5' : ''
                        }`}
                    >
                      {/* Icon box */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                        {TYPE_STYLES[notif.type].icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{notif.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.description}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">{notif.timestamp}</p>
                      </div>

                      {/* Unread dot */}
                      {!notif.read && (
                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 ${TYPE_STYLES[notif.type].dot}`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer CTA */}
                <div className="border-t border-border p-2">
                  <Link
                    href="/notifications"
                    onClick={() => setIsNotifOpen(false)}
                    className="flex items-center justify-center gap-1.5 w-full px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    Show all notifications
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              id="user-menu-btn"
              onClick={() => {
                setIsUserMenuOpen((prev) => !prev)
                setIsNotifOpen(false)
              }}
              className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer"
              aria-label="User menu"
            >
              JD
            </button>

            {isUserMenuOpen && (
              <div
                id="user-menu-dropdown"
                className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
              >
                <Link
                  href="/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  My Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  Settings
                </Link>
                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors border-t border-border cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-2 space-y-2">
            <Link href="/jobs" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors">Jobs</Link>

            <Link href="/employers" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors">Employers</Link>
            <Link href="/messages" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors">Messages</Link>
            <Link href="/notifications" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors">Notifications</Link>
            <Link href="/profile" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors">Profile</Link>
            <Link href="/dashboard/employer" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors">Employer</Link>
            <Link href="/dashboard/admin" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors">Admin</Link>
          </div>
        </div>
      )}
    </header>
  )
}
