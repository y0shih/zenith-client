export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'shortlisted'
  | 'interview'
  | 'offered'
  | 'rejected'
  | 'withdrawn'

export interface Application {
  id: string
  job_id: string
  job_title: string
  tenant_id: string
  status: ApplicationStatus
  resume_url: string | null
  cover_letter: string | null
  created_at: string
  updated_at: string
  candidate?: {
    id: string
    email: string
    full_name: string
  }
}

export interface CreateApplicationPayload {
  resume_url?: string
  cover_letter?: string
}

export interface UpdateApplicationStatusPayload {
  status: ApplicationStatus
}
