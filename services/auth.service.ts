import { api } from './api'
import { LoginPayload, RegisterCandidatePayload, RegisterEmployerPayload, AuthResponse } from '@/types/auth'

// TODO: Wire up once API is connected. Pass the real token from session/cookie.

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', payload),

  registerCandidate: (payload: RegisterCandidatePayload) =>
    api.post<AuthResponse>('/auth/register/candidate', payload),

  registerEmployer: (payload: RegisterEmployerPayload) =>
    api.post<AuthResponse>('/auth/register/employer', payload),

  refreshToken: (refreshToken: string) =>
    api.post<AuthResponse>('/auth/refresh', { refreshToken }),

  logout: (token: string) =>
    api.post<void>('/auth/logout', {}, token),
}
