// User/Profile domain types

export type UserRole = 'candidate' | 'employer' | 'admin'
export type JobSearchStatus = 'looking_for_work' | 'open_to_offers' | 'closed'

export interface CandidateProfile {
  id: string
  userId: string
  headline?: string
  bio?: string
  skills: string[]
  location?: string
  resumeUrl?: string
  jobSearchStatus: JobSearchStatus
}

export interface TenantProfile {
  id: string
  name: string
  slug: string
  description?: string
  website?: string
}

export interface UpdateCandidateProfilePayload {
  headline?: string
  bio?: string
  skills?: string[]
  location?: string
  jobSearchStatus?: JobSearchStatus
}
