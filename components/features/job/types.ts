// Shared Job type — single source of truth for the job domain
export interface Job {
  id: string
  title: string
  company: string
  description: string
  roles: string[]
  applicantCount: number
  postedDate: string
}
