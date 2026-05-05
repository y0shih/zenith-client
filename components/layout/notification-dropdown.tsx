'use client'

import { useEffect, useState } from 'react'
import { Bell, Check } from 'lucide-react'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useSession } from './session-provider'
import { notificationService, type Notification } from '@/services/notification.service'
import { formatRelativeDate } from '@/lib/display'
import Link from 'next/link'
import { toast } from 'sonner'

export function NotificationDropdown() {
  const { accessToken, isAuthenticated } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return

    let isMounted = true
    const controller = new AbortController()

    const loadInitial = async () => {
      try {
        const { notifications } = await notificationService.getNotifications(accessToken, { per_page: 20 })
        if (isMounted) {
          setNotifications(notifications || [])
          setUnreadCount((notifications || []).filter(n => !n.is_read).length)
        }
      } catch (err) {
        console.error('Failed to load notifications', err)
      }
    }

    void loadInitial()

    const connectStream = () => {
      fetchEventSource(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9666/api/v1'}/notifications/stream`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal: controller.signal,
        async onmessage(ev) {
          if (ev.event === 'notification') {
            try {
              const newNotif = JSON.parse(ev.data) as Notification
              if (isMounted) {
                setNotifications(prev => {
                  const exists = prev.some(n => n.id === newNotif.id)
                  if (exists) return prev
                  return [newNotif, ...prev]
                })
                setUnreadCount(prev => prev + 1)
                toast(newNotif.title, { description: newNotif.message })
              }
            } catch (e) {
              console.error('Error parsing notification', e)
            }
          }
        },
        onerror(err) {
          console.error('SSE Error', err)
        }
      })
    }

    connectStream()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [accessToken, isAuthenticated])

  const handleMarkAsRead = async (id: string) => {
    if (!accessToken) return
    try {
      await notificationService.markAsRead(id, accessToken)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkAllRead = async () => {
    if (!accessToken) return
    try {
      await notificationService.markAllAsRead(accessToken)
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error(err)
    }
  }

  if (!isAuthenticated) return null

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
          aria-label="Notifications"
          type="button"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-cta rounded-full" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 border-2 border-primary rounded-none shadow-[4px_4px_0_0_#0F172A]" align="end">
        <div className="flex items-center justify-between p-4 border-b-2 border-border bg-accent/30">
          <h4 className="font-heading font-bold text-primary">Notifications</h4>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Mark all read
            </button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-secondary text-sm">No notifications yet.</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${!n.is_read ? 'bg-muted/20' : ''}`}>
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h5 className="font-semibold text-sm text-primary">{n.title}</h5>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{formatRelativeDate(n.created_at)}</span>
                </div>
                <p className="text-sm text-secondary line-clamp-2 mb-2">{n.message}</p>
                <div className="flex justify-between items-center mt-2">
                  {n.link ? (
                    <Link href={n.link} className="text-xs font-bold text-cta hover:underline" onClick={() => setIsOpen(false)}>
                      View Details
                    </Link>
                  ) : <div />}
                  {!n.is_read && (
                    <button onClick={() => handleMarkAsRead(n.id)} className="text-[10px] text-muted-foreground hover:text-primary" aria-label="Mark as read">
                      <Check className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
