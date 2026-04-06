import { api } from './api'
import type { PaginationMeta } from '@/types/api'
import type { CreateJobPayload, Job, UpdateJobPayload } from '@/types/job'

export interface JobListParams {
  page?: number
  per_page?: number
  search?: string
}

export const jobService = {
  listPublic: async (params?: JobListParams) => {
    const response = await api.get<Job[]>('/jobs', { query: params })
    return {
      jobs: response.data,
      meta: response.meta as PaginationMeta | undefined,
    }
  },

  getById: (id: string) => api.get<Job>(`/jobs/${id}`).then((response) => response.data),

  create: (payload: CreateJobPayload, token: string) =>
    api.post<Job>('/jobs', payload, { token }).then((response) => response.data),

  update: (id: string, payload: UpdateJobPayload, token: string) =>
    api.put<Job>(`/jobs/${id}`, payload, { token }).then((response) => response.data),

  delete: (id: string, token: string) =>
    api.delete<void>(`/jobs/${id}`, { token }).then(() => undefined),

  close: (id: string, token: string) =>
    api.post<void>(`/jobs/${id}/close`, undefined, { token }).then(() => undefined),

  listMyJobs: async (token: string, params?: Omit<JobListParams, 'search'>) => {
    const response = await api.get<Job[]>('/my-jobs', {
      token,
      query: params,
    })
    return {
      jobs: response.data,
      meta: response.meta as PaginationMeta | undefined,
    }
  },

  listPending: async (token: string, params?: Omit<JobListParams, 'search'>) => {
    const response = await api.get<Job[]>('/jobs/pending', {
      token,
      query: params,
    })
    return {
      jobs: response.data,
      meta: response.meta as PaginationMeta | undefined,
    }
  },

  approve: (id: string, token: string) =>
    api.post<Job>(`/jobs/${id}/approve`, undefined, { token }).then((response) => response.data),

  reject: (id: string, token: string) =>
    api.post<Job>(`/jobs/${id}/reject`, undefined, { token }).then((response) => response.data),
}
