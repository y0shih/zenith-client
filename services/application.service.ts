import { api } from './api'
import type { PaginationMeta } from '@/types/api'
import type {
  Application,
  CreateApplicationPayload,
  UpdateApplicationStatusPayload,
} from '@/types/application'

export interface ApplicationListParams {
  page?: number
  per_page?: number
  status?: string
}

export const applicationService = {
  apply: (jobId: string, payload: CreateApplicationPayload, token: string) =>
    api
      .post<Application>(`/jobs/${jobId}/apply`, payload, { token })
      .then((response) => response.data),

  getMyApplications: async (token: string, params?: Omit<ApplicationListParams, 'status'>) => {
    const response = await api.get<Application[]>('/my-applications', {
      token,
      query: params,
    })
    return {
      applications: response.data,
      meta: response.meta as PaginationMeta | undefined,
    }
  },

  getForJob: async (
    jobId: string,
    token: string,
    params?: Omit<ApplicationListParams, 'status'>,
  ) => {
    const response = await api.get<Application[]>(`/jobs/${jobId}/applications`, {
      token,
      query: params,
    })
    return {
      applications: response.data,
      meta: response.meta as PaginationMeta | undefined,
    }
  },

  listTenantApplications: async (
    token: string,
    params?: ApplicationListParams,
  ) => {
    const response = await api.get<Application[]>('/applications', {
      token,
      query: params,
    })
    return {
      applications: response.data,
      meta: response.meta as PaginationMeta | undefined,
    }
  },

  updateStatus: (
    id: string,
    payload: UpdateApplicationStatusPayload,
    token: string,
  ) =>
    api
      .put<Application>(`/applications/${id}/status`, payload, { token })
      .then((response) => response.data),

  getResume: async (id: string, token: string): Promise<Blob> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:9666/api/v1'
    const response = await fetch(`${baseUrl}/applications/${id}/resume`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to load document: ${response.statusText}`)
    }
    
    return await response.blob()
  },
}
