import { api } from './api'
import type { PaginationMeta } from '@/types/api'

export interface ChatMessage {
  id: string;
  application_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender: {
    id: string;
    role: string;
    full_name: string;
  };
}

export const chatService = {
  getMessages: async (applicationId: string, token: string, params?: { page?: number; per_page?: number }) => {
    const response = await api.get<ChatMessage[]>(`/applications/${applicationId}/messages`, {
      token,
      query: params,
    })
    return {
      messages: response.data,
      meta: response.meta as PaginationMeta | undefined,
    }
  },
  sendMessage: (applicationId: string, content: string, token: string) =>
    api.post<ChatMessage>(`/applications/${applicationId}/messages`, { content }, { token }).then(res => res.data),
}
