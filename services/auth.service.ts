import { api } from './api'
import type {
  LoginResponseData,
  LoginPayload,
  RefreshResponseData,
  RegisterAdminPayload,
  RegisteredUserResponse,
  RegisterPayload,
  TenantInfo,
  SelectTenantPayload,
  AuthTokens,
} from '@/types/auth'

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<LoginResponseData>('/auth/login', payload).then((response) => response.data),

  register: (payload: RegisterPayload) =>
    api.post<RegisteredUserResponse>('/auth/register', payload).then((response) => response.data),

  refreshToken: (refreshToken: string, tenantId?: string | null) =>
    api
      .post<RefreshResponseData | LoginResponseData['tokens']>('/auth/refresh', {
        refresh_token: refreshToken,
        tenant_id: tenantId,
      })
      .then((response) => response.data),

  logout: (refreshToken: string) =>
    api.post<void>('/auth/logout', { refresh_token: refreshToken }).then(() => undefined),

  registerAdmin: (payload: RegisterAdminPayload, token: string) =>
    api
      .post<RegisteredUserResponse>('/auth/register-admin', payload, { token })
      .then((response) => response.data),

  getMyTenants: (token?: string) =>
    api.get<TenantInfo[]>('/auth/my-tenants', { token }).then((response) => response.data),

  selectTenant: (tenantId: string, token?: string) =>
    api
      .post<AuthTokens>(
        '/auth/select-tenant',
        { tenant_id: tenantId },
        { token }
      )
      .then((response) => response.data),
}
