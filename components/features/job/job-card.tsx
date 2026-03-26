import { Job } from './types'

interface JobCardProps {
  job: Job
  isSelected: boolean
  onSelect: (jobId: string) => void
}

export function JobCard({ job, isSelected, onSelect }: JobCardProps) {
  return (
    <button
      onClick={() => onSelect(job.id)}
      className={`w-full p-4 sm:p-6 text-left transition-all duration-200 ${
        isSelected
          ? 'bg-primary/10 border-l-4 border-primary'
          : 'hover:bg-muted/50'
      }`}
    >
      <h2 className="text-lg font-semibold text-card-foreground">{job.title}</h2>
      <p className="text-sm font-medium text-muted-foreground mt-1">{job.company}</p>
      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{job.description}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {job.roles.map((role) => (
          <span key={role} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
            {role}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
        <span>{job.applicantCount} applicants</span>
        <span>{job.postedDate}</span>
      </div>
    </button>
  )
}
