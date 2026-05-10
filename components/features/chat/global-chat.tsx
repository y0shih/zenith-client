'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { MessageCircle, X, ChevronDown, ChevronUp, User, Briefcase, ArrowLeft, Settings, BellOff, Ban } from 'lucide-react'
import Link from 'next/link'
import { useSession } from '@/components/layout/session-provider'
import { applicationService } from '@/services/application.service'
import type { Application } from '@/types/application'
import { formatRelativeDate } from '@/lib/display'
import { ChatUI } from './chat-ui'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function GlobalChat() {
  const { accessToken, isAuthenticated, user, isHydrated } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [applications, setApplications] = useState<Application[]>([])
  const [activeAppId, setActiveAppId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isCandidate = user?.role === 'candidate'
  const [lastMessageAt, setLastMessageAt] = useState<Map<string, string>>(() => new Map())

  const handleNewMessage = useCallback((appId: string, msg: { created_at: string }) => {
    setLastMessageAt(prev => new Map(prev).set(appId, msg.created_at))
  }, [])



  useEffect(() => {
    if (!isOpen || !accessToken) return

    let isMounted = true
    setIsLoading(true)

    async function loadConversations() {
      try {
        const response = await applicationService.getMyApplications(accessToken as string, {
          page: 1,
          per_page: 50,
        })
        if (isMounted) {
          setApplications(response.applications)
        }
      } catch (err) {
        console.error('Failed to load conversations', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadConversations()

    return () => {
      isMounted = false
    }
  }, [isOpen, accessToken])

  const activeApp = applications.find(a => a.id === activeAppId)
  const sortedApplications = [...applications].sort((a, b) => {
    const ta = lastMessageAt.get(a.id) ?? a.created_at
    const tb = lastMessageAt.get(b.id) ?? b.created_at
    return new Date(tb).getTime() - new Date(ta).getTime()
  })

  // Only show floating chat for candidates for now
  if (!isHydrated || !isAuthenticated || !isCandidate) {
    return null
  }

  return (
    <div className="fixed bottom-0 right-4 md:right-8 z-50 flex items-end gap-4 pointer-events-none">
      {/* Main Messaging Popup */}
      <div 
        className={`pointer-events-auto w-[350px] bg-card border-x-2 border-t-2 border-primary shadow-[8px_0_0_0_#0F172A] transition-all duration-300 ease-in-out flex flex-col ${
          isOpen ? 'h-[550px] translate-y-0' : 'h-[48px] translate-y-0'
        }`}
      >
        {/* Header */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="h-[48px] px-4 bg-primary text-primary-foreground flex items-center justify-between cursor-pointer hover:bg-primary/90 transition-colors"
        >
          <div className="flex items-center gap-2 font-heading font-bold">
            {activeAppId && isOpen ? (
              <ArrowLeft 
                className="w-5 h-5 mr-1 hover:text-white/80" 
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveAppId(null)
                }} 
              />
            ) : (
              <MessageCircle className="w-5 h-5" />
            )}
            <span>Messaging</span>
          </div>
          <div className="flex items-center gap-2">
            {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </div>
        </button>

        {/* Body */}
        {isOpen && (
          <div className="flex-1 bg-background flex flex-col overflow-hidden relative">
            {activeAppId ? (
              // Chat Detail View
              <div className="flex-1 flex flex-col h-full absolute inset-0 bg-card z-10">
                <div className="p-3 border-b-2 border-border bg-accent/10 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-primary truncate text-sm">
                      {activeApp?.job_title}
                    </h3>
                    <p className="text-[10px] text-secondary uppercase tracking-widest font-semibold mt-0.5">
                      {activeApp?.status.replace('_', ' ')}
                    </p>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                        <Settings className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0 rounded-none border-2 border-primary shadow-[4px_4px_0_0_#0F172A]" align="end">
                      <div className="flex flex-col">
                        <Link 
                          href="/profile/conversations" 
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted text-left transition-colors border-b-2 border-border cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4 text-primary" />
                          Open Full View
                        </Link>
                        <button className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted text-left transition-colors cursor-pointer">
                          <BellOff className="w-4 h-4 text-muted-foreground" />
                          Mute Conversation
                        </button>
                        <button className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-destructive/10 text-destructive text-left transition-colors border-t-2 border-border cursor-pointer">
                          <Ban className="w-4 h-4" />
                          Block Employer
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ChatUI applicationId={activeAppId} onNewMessage={(msg) => handleNewMessage(activeAppId, msg)} />
                </div>
              </div>
            ) : (
              // Conversation List View
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">Loading conversations...</div>
                ) : applications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center">
                    <Briefcase className="w-8 h-8 mb-3 opacity-20" />
                    No active applications yet.
                  </div>
                ) : (
                  sortedApplications.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setActiveAppId(app.id)}
                      className="w-full p-4 border-b border-border hover:bg-muted/50 transition-colors text-left flex gap-3 items-start"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary mt-1">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-sm text-primary truncate pr-2">{app.job_title}</h4>
                          <span className="text-[10px] text-muted-foreground flex-shrink-0">
                            {formatRelativeDate(lastMessageAt.get(app.id) ?? app.created_at)}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-secondary uppercase tracking-wider">
                          Status: {app.status.replace('_', ' ')}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
