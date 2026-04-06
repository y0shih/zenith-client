import { api } from './api'
import type { PaginationMeta } from '@/types/api'

export interface JobCommentAuthor {
  id: string
  email: string
  full_name: string
  role: string
}

export interface JobComment {
  id: string
  job_id: string
  parent_id: string | null
  content: string
  is_official_reply: boolean
  created_at: string
  updated_at: string
  author: JobCommentAuthor
  replies: JobComment[]
}

export interface CreateCommentPayload {
  content: string
  parent_id?: string
}

export const commentService = {
  listForJob: async (jobId: string, params?: { page?: number; per_page?: number }) => {
    const response = await api.get<JobComment[]>(`/jobs/${jobId}/comments`, {
      query: params,
    })

    return {
      comments: response.data,
      meta: response.meta as PaginationMeta | undefined,
    }
  },

  create: (jobId: string, payload: CreateCommentPayload, token: string) =>
    api
      .post<JobComment>(`/jobs/${jobId}/comments`, payload, { token })
      .then((response) => response.data),

  update: (commentId: string, payload: { content: string }, token: string) =>
    api
      .put<JobComment>(`/comments/${commentId}`, payload, { token })
      .then((response) => response.data),

  delete: (commentId: string, token: string) =>
    api.delete<void>(`/comments/${commentId}`, { token }).then(() => undefined),
}
