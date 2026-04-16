export type UserRole = 'candidate' | 'employer' | 'tenant_admin' | 'system_admin'

export type CandidateProfileStatus = 'looking_for_work' | 'closed'

export interface AuthUser {
  id: string
  email: string
  full_name: string
  role: UserRole
  tenant_id: string | null
}

export interface CandidateProfile {
  id: string
  user_id: string
  headline: string | null
  bio: string | null
  avatar_url: string | null
  phone: string | null
  resume_url: string | null
  portfolio_url: string | null
  skills: string[]
  experience_years: number | null
  location: string | null
  status: CandidateProfileStatus
  created_at: string
  updated_at: string
}

export interface CandidateResume {
  id: string
  file_name: string
  original_name: string
  file_url: string
  is_primary: boolean
  created_at: string
  updated_at: string
}

export interface CreateResumePayload {
  file_name: string
  original_name?: string
  file_url: string
  is_primary?: boolean
}

export interface UpdateResumePayload {
  file_name: string
  is_primary: boolean
}


export interface UpdateCandidateProfilePayload {
  headline?: string
  bio?: string
  avatar_url?: string
  phone?: string
  resume_url?: string
  portfolio_url?: string
  skills?: string[]
  experience_years?: number
  location?: string
  status?: CandidateProfileStatus
}

export interface EmployerProfile {
  id: string
  user_id: string
  job_title: string | null
  bio: string | null
  avatar_url: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface UpdateEmployerProfilePayload {
  job_title?: string
  bio?: string
  avatar_url?: string
  phone?: string
}

export interface Tenant {
  id: string
  name: string
  slug: string
  is_active: boolean
  created_at: string
  updated_at: string
  tenant_admin?: {
    id: string
    email: string
    full_name: string
  } | null
}

export interface CreateTenantPayload {
  name: string
  slug?: string
}

export interface UpdateTenantPayload {
  name?: string
  is_active?: boolean
}

export interface TenantAdminAssignment {
  id: string
  user_id: string
  tenant_id: string
  created_at: string
}
