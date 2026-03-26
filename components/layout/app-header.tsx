'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ThemeToggle } from './theme-toggle'

export function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const notificationCount = 3

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/jobs" className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">
            ZG
          </div>
          <span className="hidden sm:inline">Zenith-Go</span>
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
          <Link
            href="/notifications"
            className="relative text-sm text-foreground hover:text-primary transition-colors"
          >
            Notifications
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Notifications Bell - Mobile */}
          <button className="relative p-2 hover:bg-muted rounded-lg transition-colors md:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              JD
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                  My Profile
                </Link>
                <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                  Settings
                </Link>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors border-t border-border">
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
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
          </div>
        </div>
      )}
    </header>
  )
}
