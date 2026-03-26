'use client'

interface Notification {
  id: string
  type: 'application' | 'message' | 'interview' | 'update'
  title: string
  description: string
  timestamp: string
  read: boolean
  icon: string
}

export default function NotificationsPage() {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'application',
      title: 'Application Viewed',
      description: 'Tech Corp viewed your application for Senior Full Stack Engineer',
      timestamp: '2 hours ago',
      read: false,
      icon: '👁️',
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message',
      description: 'Sarah Chen from Tech Corp sent you a message',
      timestamp: '1 hour ago',
      read: false,
      icon: '💬',
    },
    {
      id: '3',
      type: 'interview',
      title: 'Interview Scheduled',
      description: 'Your interview with Cloud Systems is scheduled for March 29, 2026',
      timestamp: '1 day ago',
      read: false,
      icon: '📅',
    },
    {
      id: '4',
      type: 'update',
      title: 'Job Recommendation',
      description: 'We found a new job matching your profile - Product Manager at StartUp Inc',
      timestamp: '2 days ago',
      read: true,
      icon: '⭐',
    },
    {
      id: '5',
      type: 'application',
      title: 'Application Rejected',
      description: 'Your application for UX Designer at Design Studio was not selected',
      timestamp: '3 days ago',
      read: true,
      icon: '❌',
    },
  ]

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'application':
        return 'bg-blue-100 text-blue-700'
      case 'message':
        return 'bg-green-100 text-green-700'
      case 'interview':
        return 'bg-purple-100 text-purple-700'
      case 'update':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6">
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay updated with your job search activity
          </p>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-border">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 transition-colors ${
                !notification.read ? 'bg-primary/5' : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${getTypeColor(notification.type)}`}>
                  {notification.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {notification.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="flex items-center justify-center h-96 text-center">
            <div>
              <p className="text-2xl mb-2">🔔</p>
              <p className="text-foreground font-medium">No notifications</p>
              <p className="text-sm text-muted-foreground mt-1">
                Check back later for updates on your job search
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
