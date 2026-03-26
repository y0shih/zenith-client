import { api } from './api'
import {
  Application,
  CreateApplicationPayload,
  UpdateApplicationStatusPayload,
} from '@/types/application'

// TODO: Pass real token from session/cookie once API is connected.

export const applicationService = {
  apply: (payload: CreateApplicationPayload, token: string) =>
    api.post<Application>('/applications', payload, token),

  getMyApplications: (token: string) =>
    api.get<Application[]>('/applications/me', token),

  getForJob: (jobId: string, token: string) =>
    api.get<Application[]>(`/applications/job/${jobId}`, token),

  updateStatus: (id: string, payload: UpdateApplicationStatusPayload, token: string) =>
    api.patch<Application>(`/applications/${id}/status`, payload, token),
}
