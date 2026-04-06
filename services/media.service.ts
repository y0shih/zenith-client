import { api } from './api'

export interface MediaUploadResponse {
  message: string
  url: string
  key: string
}

export const mediaService = {
  upload: (type: 'posts' | 'profiles' | 'media', file: File, token: string) => {
    const body = new FormData()
    body.append('file', file)

    return api
      .post<MediaUploadResponse>(`/media/upload/${type}`, body, { token })
      .then((response) => response.data)
  },
}
