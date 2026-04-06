import type { AuthUser, UserRole } from './user'

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
  tenant_id?: string
}

export interface RegisterAdminPayload {
  email: string
  password: string
  full_name: string
  tenant_id: string
  role: 'tenant_admin'
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface LoginResponseData {
  tokens: AuthTokens
  user: AuthUser
}

export interface RefreshResponseData {
  tokens: AuthTokens
  user?: AuthUser
}

export interface TenantInfo {
  id: string
  name: string
  slug: string
}

export interface SelectTenantPayload {
  tenant_id: string
}

export interface RegisteredUserResponse {
  id: string
  email: string
  role: Extract<UserRole, 'candidate' | 'employer' | 'tenant_admin'>
  full_name: string
  tenant_id: string | null
}
