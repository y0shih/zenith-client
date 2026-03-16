'use client'

import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Job } from './job-board-layout'

interface JobDetailViewProps {
  job: Job
}

export function JobDetailView({ job }: JobDetailViewProps) {
  const reactions = [
    { icon: Heart, label: 'Interested', count: 24 },
    { icon: MessageCircle, label: 'Comments', count: 8 },
    { icon: Share2, label: 'Share', count: 5 },
  ]

  return (
    <div className="flex flex-col h-full relative">
      {/* Sticky Apply Button */}
      <div className="sticky top-0 z-20 p-6 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap">
          Apply Now
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Company Section */}
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground mb-3">About the Role</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-foreground mb-2">Job Type</h3>
              <p className="text-sm text-muted-foreground">Full-time</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Posted</h3>
              <p className="text-sm text-muted-foreground">{job.postedDate}</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Applicants</h3>
              <p className="text-sm text-muted-foreground">{job.applicantCount} people have applied</p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground mb-3">Description</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Roles Section */}
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground mb-3">Roles & Responsibilities</h2>
          <ul className="space-y-2">
            {job.roles.map((role, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-primary font-semibold mt-1">•</span>
                <span className="text-sm text-muted-foreground">{role}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills Section */}
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground mb-3">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {['JavaScript', 'React', 'TypeScript', 'Node.js', 'Tailwind CSS'].map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Reactions Section */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-4">
            {reactions.map((reaction) => {
              const Icon = reaction.icon
              return (
                <button
                  key={reaction.label}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{reaction.count}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Comments Section */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Comments ({3})</h2>
          <div className="space-y-4">
            {/* Comment Input */}
            <div className="flex gap-3 pb-4 border-b border-border">
              <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 text-sm bg-transparent border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Comments List */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-foreground">John Doe</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    This looks like a great opportunity. Does the role include remote work options?
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Like
                    </button>
                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
