// Auth domain types — mirrors the backend auth payloads
import { UserRole } from './user'

export type { UserRole }

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  role: 'candidate' | 'employer'
  full_name: string
  tenant_id?: string // Required only if role is "employer"
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: {
    id: string
    email: string
    full_name: string
    role: 'candidate' | 'employer' | 'admin'
  }
}
