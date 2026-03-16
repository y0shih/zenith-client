'use client'

import { Job } from './job-board-layout'
import { JobDetailView } from './job-detail-view'

interface JobDetailPanelProps {
  selectedJobId: string | null
}

// Mock job data for demo - will be replaced with API calls
const mockJobs: Record<string, Job> = {
  '1': {
    id: '1',
    title: 'Senior Full Stack Engineer',
    company: 'Tech Corp',
    description: 'We are looking for an experienced full-stack engineer to join our growing team. You will work on building scalable web applications using modern technologies. This is a great opportunity to work with a talented team and make a real impact on our product.',
    roles: ['Design and implement RESTful APIs', 'Build responsive web interfaces', 'Optimize database queries', 'Mentor junior developers', 'Participate in code reviews'],
    applicantCount: 24,
    postedDate: '2 days ago',
  },
  '2': {
    id: '2',
    title: 'Product Designer',
    company: 'Design Studios',
    description: 'Join our design team and create beautiful user experiences. We are looking for a talented product designer with a strong portfolio and experience in user research.',
    roles: ['Create wireframes and prototypes', 'Conduct user research', 'Collaborate with engineers', 'Design systems development'],
    applicantCount: 18,
    postedDate: '1 day ago',
  },
  '3': {
    id: '3',
    title: 'DevOps Engineer',
    company: 'Cloud Systems',
    description: 'Looking for a DevOps expert to manage our cloud infrastructure and improve deployment processes. Experience with Kubernetes and AWS is essential.',
    roles: ['Manage cloud infrastructure', 'Build CI/CD pipelines', 'Monitor system performance', 'Implement security protocols'],
    applicantCount: 15,
    postedDate: '3 days ago',
  },
}

export function JobDetailPanel({ selectedJobId }: JobDetailPanelProps) {
  const selectedJob = selectedJobId ? mockJobs[selectedJobId] : null

  return (
    <aside
      className={`hidden lg:flex lg:flex-col lg:w-1/2 bg-background border-l border-border transition-all duration-300 ${
        !selectedJobId ? 'items-center justify-center' : ''
      }`}
    >
      {selectedJob ? (
        <JobDetailView job={selectedJob} />
      ) : (
        <div className="text-center">
          <p className="text-muted-foreground">Select a job to view details</p>
        </div>
      )}
    </aside>
  )
}
