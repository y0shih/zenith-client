'use client'

import { useEffect, useState, useRef } from 'react'
import { chatService, type ChatMessage } from '@/services/chat.service'
import { useSession } from '@/components/layout/session-provider'
import { formatRelativeDate } from '@/lib/display'
import { Button } from '@/components/ui/button'

export function ChatUI({ applicationId }: { applicationId: string }) {
  const { accessToken, user } = useSession()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!accessToken) return

    let isMounted = true
    const controller = new AbortController()

    const loadMessages = async () => {
      try {
        const res = await chatService.getMessages(applicationId, accessToken, { per_page: 50 })
        if (isMounted) {
          setMessages(res.messages || []) // Backend already sorts ASC (oldest first)
          scrollToBottom()
        }
      } catch (e) {
        console.error(e)
      }
    }

    void loadMessages()

    const connectWebSocket = () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9666/api/v1'
      // Convert http/https to ws/wss
      const wsUrl = baseUrl.replace(/^http/, 'ws') + `/applications/${applicationId}/messages/ws?token=${accessToken}`
      
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        console.log('WebSocket connected')
      }

      ws.onmessage = (event) => {
        try {
          const newMsg = JSON.parse(event.data) as ChatMessage
          if (isMounted && newMsg.id) {
            setMessages(prev => {
              if (prev.some(m => m.id === newMsg.id)) return prev
              return [...prev, newMsg]
            })
            scrollToBottom()
          }
        } catch (e) {
          console.error('WebSocket parse error:', e)
        }
      }

      ws.onerror = (err) => {
        console.error('WebSocket error:', err)
      }

      ws.onclose = () => {
        if (isMounted) {
          console.log('WebSocket closed, reconnecting in 2s...')
          setTimeout(connectWebSocket, 2000)
        }
      }

      return ws
    }

    const ws = connectWebSocket()

    return () => {
      isMounted = false
      controller.abort()
      if (ws) {
        ws.close()
      }
    }
  }, [applicationId, accessToken])

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, 100)
  }

  const handleSend = async () => {
    if (!text.trim() || !accessToken) return
    const content = text.trim()
    setText('') // Optimistic clear
    
    try {
      const newMsg = await chatService.sendMessage(applicationId, content, accessToken)
      setMessages(prev => {
        if (prev.some(m => m.id === newMsg.id)) return prev
        return [...prev, newMsg]
      })
      scrollToBottom()
    } catch (e) {
      console.error(e)
      setText(content) // Revert on failure
    }
  }

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 && <p className="text-center text-muted-foreground text-sm mt-4">No messages yet.</p>}
        {messages.map(msg => {
          const isMine = user?.id === msg.sender.id
          return (
            <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-muted-foreground mb-1">
                {msg.sender.full_name || (isMine ? 'You' : msg.sender.role)} - {formatRelativeDate(msg.created_at)}
              </span>
              <div className={`px-4 py-2 rounded-none border-2 max-w-[80%] ${isMine ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>
                {msg.content}
              </div>
            </div>
          )
        })}
      </div>
      <div className="p-4 border-t-2 border-border flex gap-2">
        <input 
          type="text"
          className="flex-1 border-2 border-border p-2 focus:border-primary outline-none"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
        />
        <Button onClick={handleSend} className="rounded-none">Send</Button>
      </div>
    </div>
  )
}
