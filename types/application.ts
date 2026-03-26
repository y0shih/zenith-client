// Application domain types

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
  jobId: string
  candidateId: string
  status: ApplicationStatus
  resumeUrl?: string
  coverLetter?: string
  appliedAt: string
  updatedAt: string
}

export interface CreateApplicationPayload {
  jobId: string
  resumeUrl?: string
  coverLetter?: string
}

export interface UpdateApplicationStatusPayload {
  status: ApplicationStatus
}
