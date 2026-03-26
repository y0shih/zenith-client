// Job domain types — mirrors the backend Job entity

export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship'
export type JobStatus = 'draft' | 'active' | 'closed' | 'archived'

export interface Job {
  id: string
  tenantId: string
  title: string
  description: string
  location: string
  jobType: JobType
  salaryMin?: number
  salaryMax?: number
  status: JobStatus
  createdAt: string
  updatedAt: string
}

export interface CreateJobPayload {
  title: string
  description: string
  location: string
  jobType: JobType
  salaryMin?: number
  salaryMax?: number
}

export interface UpdateJobPayload extends Partial<CreateJobPayload> {
  status?: JobStatus
}
