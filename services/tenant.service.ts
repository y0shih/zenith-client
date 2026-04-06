import { api } from './api'
import type { PaginationMeta } from '@/types/api'
import type {
  CreateTenantPayload,
  Tenant,
  TenantAdminAssignment,
  UpdateTenantPayload,
} from '@/types/user'

export const tenantService = {
  list: async (token: string, params?: { page?: number; per_page?: number }) => {
    const response = await api.get<Tenant[]>('/tenants', {
      token,
      query: params,
    })

    return {
      tenants: response.data,
      meta: response.meta as PaginationMeta | undefined,
    }
  },

  getById: (id: string, token: string) =>
    api.get<Tenant>(`/tenants/${id}`, { token }).then((response) => response.data),

  create: (payload: CreateTenantPayload, token: string) =>
    api.post<Tenant>('/tenants', payload, { token }).then((response) => response.data),

  update: (id: string, payload: UpdateTenantPayload, token: string) =>
    api.put<Tenant>(`/tenants/${id}`, payload, { token }).then((response) => response.data),

  assignAdmin: (id: string, userId: string, token: string) =>
    api
      .post<TenantAdminAssignment>(`/tenants/${id}/admin`, { user_id: userId }, { token })
      .then((response) => response.data),
}
