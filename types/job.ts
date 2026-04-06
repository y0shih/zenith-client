export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship'
export type JobStatus = 'pending' | 'approved' | 'rejected' | 'closed'

export interface Job {
  id: string
  tenant_id: string
  employer_id: string
  title: string
  description: string
  location: string
  job_type: JobType | null
  salary_min: number | null
  salary_max: number | null
  status: JobStatus
  approved_at: string | null
  created_at: string
  updated_at: string
}

export interface CreateJobPayload {
  title: string
  description: string
  location: string
  job_type?: JobType
  salary_min?: number
  salary_max?: number
}

export interface UpdateJobPayload extends Partial<CreateJobPayload> {
  status?: JobStatus
}
