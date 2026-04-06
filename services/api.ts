import type {
  ApiEnvelope,
  ApiErrorPayload,
  ApiResult,
  PaginationMeta,
} from '@/types/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:9666/api/v1'

type QueryValue = string | number | boolean | null | undefined

export type SessionFailureReason = 'expired' | 'tenant_required'

type SessionFailureListener = (reason: SessionFailureReason) => void

const sessionFailureListeners: Set<SessionFailureListener> = new Set()

function notifySessionFailure(reason: SessionFailureReason) {
  sessionFailureListeners.forEach((listener) => listener(reason))
}

export class ApiError extends Error {
  status: number
  code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  token?: string
  query?: object
  body?: BodyInit | object | null
}

function buildUrl(path: string, query?: object) {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  const url = new URL(normalizedPath, `${BASE_URL}/`)

  if (!query) {
    return url.toString()
  }

  for (const [key, value] of Object.entries(query as Record<string, QueryValue>)) {
    if (value === undefined || value === null || value === '') {
      continue
    }

    url.searchParams.set(key, String(value))
  }

  return url.toString()
}

function isBodyInit(value: RequestOptions['body']): value is BodyInit {
  return (
    value instanceof FormData ||
    value instanceof URLSearchParams ||
    typeof value === 'string' ||
    value instanceof Blob ||
    value instanceof ArrayBuffer
  )
}

async function parseResponseBody(response: Response) {
  if (response.status === 204) {
    return null
  }

  const text = await response.text()
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text) as ApiEnvelope<unknown> | Record<string, unknown>
  } catch {
    return text
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
  const { token, query, body, headers, ...fetchOptions } = options
  const nextHeaders = new Headers(headers)

  if (token) {
    nextHeaders.set('Authorization', `Bearer ${token}`)
  }

  let nextBody: BodyInit | undefined
  if (body !== undefined && body !== null) {
    if (isBodyInit(body)) {
      nextBody = body
    } else {
      nextHeaders.set('Content-Type', 'application/json')
      nextBody = JSON.stringify(body)
    }
  }

  const response = await fetch(buildUrl(path, query), {
    ...fetchOptions,
    body: nextBody,
    headers: nextHeaders,
    cache: 'no-store',
  })

  const payload = await parseResponseBody(response)

  if (!response.ok) {
    const errorPayload =
      typeof payload === 'object' && payload && 'error' in payload
        ? (payload.error as ApiErrorPayload)
        : undefined

    if (response.status === 401 || response.status === 403) {
      notifySessionFailure('expired')
    } else if (
      response.status === 400 &&
      (errorPayload?.message?.includes('Tenant context required') ||
        (typeof payload === 'object' &&
          payload &&
          'message' in payload &&
          String(payload.message).includes('Tenant context required')))
    ) {
      notifySessionFailure('tenant_required')
    }

    throw new ApiError(
      response.status,
      errorPayload?.message ??
        (typeof payload === 'object' && payload && 'message' in payload
          ? String(payload.message)
          : `HTTP ${response.status}`),
      errorPayload?.code,
    )
  }

  if (!payload) {
    return { data: undefined as T }
  }

  if (
    typeof payload === 'object' &&
    payload &&
    'success' in payload &&
    payload.success === true &&
    'data' in payload
  ) {
    return {
      data: payload.data as T,
      meta: 'meta' in payload ? (payload.meta as PaginationMeta | undefined) : undefined,
    }
  }

  return { data: payload as T }
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(
    path: string,
    body?: RequestOptions['body'],
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) => request<T>(path, { ...options, method: 'POST', body }),

  put: <T>(
    path: string,
    body?: RequestOptions['body'],
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) => request<T>(path, { ...options, method: 'PUT', body }),

  patch: <T>(
    path: string,
    body?: RequestOptions['body'],
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) => request<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'DELETE' }),

  onSessionFailure: (listener: SessionFailureListener) => {
    sessionFailureListeners.add(listener)
    return () => {
      sessionFailureListeners.delete(listener)
    }
  },
}
