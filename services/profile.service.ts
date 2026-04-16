import { api } from './api'
import type {
  CandidateProfile,
  CandidateResume,
  CreateResumePayload,
  EmployerProfile,
  UpdateCandidateProfilePayload,
  UpdateEmployerProfilePayload,
  UpdateResumePayload,
} from '@/types/user'

export const profileService = {
  getCandidateProfile: (token: string) =>
    api.get<CandidateProfile>('/candidate-profile/me', { token }).then((response) => response.data),

  updateCandidateProfile: (payload: UpdateCandidateProfilePayload, token: string) =>
    api
      .put<CandidateProfile>('/candidate-profile/me', payload, { token })
      .then((response) => response.data),

  getEmployerProfile: (token: string) =>
    api.get<EmployerProfile>('/employer-profile/me', { token }).then((response) => response.data),

  updateEmployerProfile: (payload: UpdateEmployerProfilePayload, token: string) =>
    api
      .put<EmployerProfile>('/employer-profile/me', payload, { token })
      .then((response) => response.data),

  listEmployers: (token: string, params?: { page?: number; per_page?: number }) =>
    api
      .get<EmployerProfile[]>('/employer-profile', { token, query: params })
      .then((response) => ({
        employers: response.data,
        meta: response.meta,
      })),

  getEmployerById: (userId: string, token: string) =>
    api
      .get<EmployerProfile>(`/employer-profile/${userId}`, { token })
      .then((response) => response.data),

  deleteEmployer: (userId: string, token: string) =>
    api.delete<void>(`/employer-profile/${userId}`, { token }).then(() => undefined),

  listCandidates: (params?: { page?: number; per_page?: number }) =>
    api.get<CandidateProfile[]>('/candidates', { query: params }).then((response) => ({
      candidates: response.data,
      meta: response.meta,
    })),

  getCandidateById: (id: string) =>
    api.get<CandidateProfile>(`/candidates/${id}`).then((response) => response.data),

  listResumes: (token: string) =>
    api
      .get<CandidateResume[]>('/candidate-profile/me/resumes', { token })
      .then((response) => response.data ?? []),

  createResume: (payload: CreateResumePayload, token: string) =>
    api
      .post<CandidateResume>('/candidate-profile/me/resumes', payload, { token })
      .then((response) => response.data),

  updateResume: (id: string, payload: UpdateResumePayload, token: string) =>
    api
      .put<CandidateResume>(`/candidate-profile/me/resumes/${id}`, payload, { token })
      .then((response) => response.data),

  deleteResume: (id: string, token: string) =>
    api.delete<void>(`/candidate-profile/me/resumes/${id}`, { token }).then(() => undefined),
}
