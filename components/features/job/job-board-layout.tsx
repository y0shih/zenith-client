'use client'

import { useState } from 'react'
import { JobFeedPanel } from './job-feed-panel'
import { JobDetailPanel } from './job-detail-panel'

export function JobBoardLayout() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <JobFeedPanel selectedJobId={selectedJobId} onSelectJob={setSelectedJobId} />
      <JobDetailPanel selectedJobId={selectedJobId} />
    </div>
  )
}
