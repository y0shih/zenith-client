import { api } from './api'
import { LoginPayload, RegisterPayload, AuthResponse } from '@/types/auth'

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', payload),

  refreshToken: (refreshToken: string) =>
    api.post<AuthResponse>('/auth/refresh', { refresh_token: refreshToken }),

  logout: (token: string) =>
    api.post<void>('/auth/logout', {}, token),
}
