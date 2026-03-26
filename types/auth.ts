// Auth domain types — mirrors the backend auth payloads

export type UserRole = 'candidate' | 'employer' | 'admin'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterCandidatePayload {
  name: string
  email: string
  password: string
}

export interface RegisterEmployerPayload {
  name: string
  email: string
  password: string
  tenantId: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name: string
    role: UserRole
  }
}
