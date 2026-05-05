import { api } from './api'
import type { PaginationMeta } from '@/types/api'

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export const notificationService = {
  getNotifications: async (token: string, params?: { page?: number; per_page?: number; unread_only?: boolean }) => {
    const response = await api.get<Notification[]>('/notifications', {
      token,
      query: params,
    })
    return {
      notifications: response.data,
      meta: response.meta as PaginationMeta | undefined,
    }
  },
  markAsRead: (id: string, token: string) =>
    api.put(`/notifications/${id}/read`, {}, { token }).then(res => res.data),
  markAllAsRead: (token: string) =>
    api.put(`/notifications/read-all`, {}, { token }).then(res => res.data),
}
