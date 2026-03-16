'use client'

import { useState } from 'react'
import { JobFeedPanel } from './job-feed-panel'
import { JobDetailPanel } from './job-detail-panel'

export interface Job {
  id: string
  title: string
  company: string
  description: string
  roles: string[]
  applicantCount: number
  postedDate: string
}

export function JobBoardLayout() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Feed Panel */}
      <JobFeedPanel
        selectedJobId={selectedJobId}
        onSelectJob={setSelectedJobId}
      />

      {/* Detail Panel - Hidden on mobile, visible on lg+ */}
      <JobDetailPanel selectedJobId={selectedJobId} />
    </div>
  )
}
