'use client'

import { useState } from 'react'

interface Conversation {
  id: string
  name: string
  company: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: boolean
}

interface Message {
  id: string
  sender: 'user' | 'other'
  content: string
  timestamp: string
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string>('1')
  const [messageText, setMessageText] = useState('')

  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      company: 'Tech Corp',
      avatar: 'SC',
      lastMessage: 'Great! We would like to move forward with your application',
      timestamp: '2 hours ago',
      unread: true,
    },
    {
      id: '2',
      name: 'Mike Johnson',
      company: 'Design Studios',
      avatar: 'MJ',
      lastMessage: 'Can you share your portfolio?',
      timestamp: '1 day ago',
      unread: false,
    },
    {
      id: '3',
      name: 'Lisa Kumar',
      company: 'Cloud Systems',
      avatar: 'LK',
      lastMessage: 'Interview scheduled for next week',
      timestamp: '3 days ago',
      unread: false,
    },
  ]

  const messages: Record<string, Message[]> = {
    '1': [
      {
        id: '1',
        sender: 'other',
        content: 'Hi! Thanks for applying to our Senior Full Stack Engineer role',
        timestamp: '2 days ago',
      },
      {
        id: '2',
        sender: 'user',
        content: 'Thank you for considering my application!',
        timestamp: '2 days ago',
      },
      {
        id: '3',
        sender: 'other',
        content: 'Great! We would like to move forward with your application',
        timestamp: '2 hours ago',
      },
    ],
    '2': [
      {
        id: '1',
        sender: 'other',
        content: 'Can you share your portfolio?',
        timestamp: '1 day ago',
      },
    ],
    '3': [
      {
        id: '1',
        sender: 'other',
        content: 'Interview scheduled for next week',
        timestamp: '3 days ago',
      },
    ],
  }

  const currentMessages = messages[selectedConversation] || []
  const currentConversation = conversations.find((c) => c.id === selectedConversation)

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      {/* Conversations List */}
      <div className="w-full md:w-80 border-r border-border flex flex-col overflow-hidden shrink-0">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`w-full p-4 border-b border-border text-left transition-colors ${
                selectedConversation === conversation.id
                  ? 'bg-primary/10 border-l-4 border-l-primary'
                  : 'hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {conversation.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-foreground truncate">
                      {conversation.name}
                    </h3>
                    {conversation.unread && (
                      <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.company}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {currentConversation ? (
        <div className="hidden md:flex md:flex-1 flex-col bg-card">
          {/* Header */}
          <div className="border-b border-border p-4">
            <h2 className="font-semibold text-foreground">{currentConversation.name}</h2>
            <p className="text-sm text-muted-foreground">{currentConversation.company}</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md w-fit px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user'
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium">
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex md:flex-1 items-center justify-center text-muted-foreground">
          Select a conversation to start messaging
        </div>
      )}
    </div>
  )
}
