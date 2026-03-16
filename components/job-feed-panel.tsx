'use client'

import { Job } from './job-board-layout'
import { JobCard } from './job-card'

interface JobFeedPanelProps {
  selectedJobId: string | null
  onSelectJob: (jobId: string) => void
}

export function JobFeedPanel({
  selectedJobId,
  onSelectJob,
}: JobFeedPanelProps) {
  // Placeholder data for Phase 1
  const jobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Engineer',
      company: 'Tech Corp',
      description: 'Build amazing user experiences with React',
      roles: ['React', 'TypeScript', 'Tailwind'],
      applicantCount: 24,
      postedDate: '2 days ago',
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'StartUp Inc',
      description: 'Join our growing team and build innovative solutions',
      roles: ['Node.js', 'React', 'PostgreSQL'],
      applicantCount: 18,
      postedDate: '1 week ago',
    },
    {
      id: '3',
      title: 'Product Designer',
      company: 'Design Studio',
      description: 'Create beautiful and functional user interfaces',
      roles: ['Figma', 'UI Design', 'Prototyping'],
      applicantCount: 12,
      postedDate: '3 days ago',
    },
  ]

  return (
    <aside className="w-full lg:w-1/2 border-r border-border bg-card transition-all duration-300 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card p-4 sm:p-6 px-2 lg:px-6">
        <h1 className="text-2xl font-bold text-card-foreground">Jobs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {jobs.length} opportunities available
        </p>
      </div>

      {/* Job List - scrollable with mobile padding */}
      <div className="flex-1 overflow-y-auto px-2 lg:px-0">
        <div className="divide-y divide-border">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSelected={selectedJobId === job.id}
              onSelect={onSelectJob}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}
