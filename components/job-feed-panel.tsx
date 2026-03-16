'use client'

import { Job } from './job-board-layout'

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
    <aside className="w-full lg:w-1/2 border-r border-border overflow-y-auto bg-card">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border bg-card p-4 sm:p-6">
          <h1 className="text-2xl font-bold text-card-foreground">Jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {jobs.length} opportunities available
          </p>
        </div>

        {/* Job List */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-border">
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => onSelectJob(job.id)}
                className={`w-full p-4 sm:p-6 text-left transition-colors ${
                  selectedJobId === job.id
                    ? 'bg-primary/10 border-l-4 border-primary'
                    : 'hover:bg-muted/50'
                }`}
              >
                <h2 className="text-lg font-semibold text-card-foreground">
                  {job.title}
                </h2>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  {job.company}
                </p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.roles.map((role) => (
                    <span
                      key={role}
                      className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                    >
                      {role}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                  <span>{job.applicantCount} applicants</span>
                  <span>{job.postedDate}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
