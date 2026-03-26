import { api } from './api'
import { Job, CreateJobPayload, UpdateJobPayload } from '@/types/job'

// TODO: Pass real token from session/cookie once API is connected.

export const jobService = {
  getAll: (token: string) =>
    api.get<Job[]>('/jobs', token),

  getById: (id: string) =>
    api.get<Job>(`/jobs/${id}`),

  create: (payload: CreateJobPayload, token: string) =>
    api.post<Job>('/jobs', payload, token),

  update: (id: string, payload: UpdateJobPayload, token: string) =>
    api.patch<Job>(`/jobs/${id}`, payload, token),

  delete: (id: string, token: string) =>
    api.delete<void>(`/jobs/${id}`, token),
}
