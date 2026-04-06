export interface PaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  meta?: PaginationMeta
}

export interface ApiErrorPayload {
  code: string
  message: string
}

export interface ApiErrorResponse {
  success: false
  error: ApiErrorPayload
}

export type ApiEnvelope<T> = ApiSuccessResponse<T> | ApiErrorResponse

export interface ApiResult<T> {
  data: T
  meta?: PaginationMeta
}
