'use client'

import { Job } from './types'
import { JobCard } from './job-card'

interface JobFeedPanelProps {
  selectedJobId: string | null
  onSelectJob: (jobId: string) => void
}

// Mock data — will be replaced by job.service.ts once API is connected
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Full Stack Engineer',
    company: 'Tech Corp',
    description: 'We are looking for an experienced full-stack engineer to join our growing team. You will work on building scalable web applications using modern technologies.',
    roles: ['Design and implement RESTful APIs', 'Build responsive web interfaces', 'Optimize database queries', 'Mentor junior developers', 'Participate in code reviews'],
    applicantCount: 24,
    postedDate: '2 days ago',
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'Design Studios',
    description: 'Join our design team and create beautiful user experiences. We are looking for a talented product designer with a strong portfolio.',
    roles: ['Create wireframes and prototypes', 'Conduct user research', 'Collaborate with engineers', 'Design systems development'],
    applicantCount: 18,
    postedDate: '1 day ago',
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    company: 'Cloud Systems',
    description: 'Looking for a DevOps expert to manage our cloud infrastructure and improve deployment processes. Experience with Kubernetes and AWS is essential.',
    roles: ['Manage cloud infrastructure', 'Build CI/CD pipelines', 'Monitor system performance', 'Implement security protocols'],
    applicantCount: 15,
    postedDate: '3 days ago',
  },
]

export function JobFeedPanel({ selectedJobId, onSelectJob }: JobFeedPanelProps) {
  const jobs = mockJobs

  return (
    <aside className="w-full lg:w-1/2 border-r border-border bg-card transition-all duration-300 flex flex-col overflow-hidden">
      <div className="sticky top-0 z-10 border-b border-border bg-card p-4 sm:p-6 px-2 lg:px-6">
        <h1 className="text-2xl font-bold text-card-foreground">Jobs</h1>
        <p className="text-sm text-muted-foreground mt-1">{jobs.length} opportunities available</p>
      </div>

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
