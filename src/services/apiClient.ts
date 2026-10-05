import { API_BASE_URL } from '@/config/api';
import { SESSION_EXPIRED_EVENT } from '@/context/SessionContext';
import { clearSession, getSession } from '@/utils/session';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
  query?: QueryParams;
  /** Token explícito. Si se define tiene prioridad sobre la sesión guardada. */
  token?: string | null;
};

/** Estado + cuerpo de la respuesta, sin lanzar por el status HTTP. */
export type RawResponse<T> = {
  status: number;
  data: T | null;
};

const ERROR_FALLBACK = 'Ocurrió un error al completar la operación. Intenta nuevamente.';
const CONNECTION_ERROR = 'No se pudo conectar con el servidor. Verifica tu conexión.';

function buildQuery(query: QueryParams): string {
  const params = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return params ? `?${params}` : '';
}

function buildUrl(path: string, query?: QueryParams): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;

  return `${API_BASE_URL}${normalized}${buildQuery(query ?? {})}`;
}

function resolveToken(explicitToken?: string | null): string | null {
  if (explicitToken !== undefined) return explicitToken;

  return getSession()?.token ?? null;
}

async function parseBody<T>(response: Response): Promise<T | null> {
  if (response.status === 204) return null;

  const raw = await response.text();

  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}

function mensajeDeError(data: unknown): string {
  if (data === null || typeof data !== 'object') return ERROR_FALLBACK;

  const payload = data as Record<string, unknown>;
  const detail = payload.detail ?? payload.message ?? payload.error;

  if (typeof detail === 'string' && detail) return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0] as Record<string, unknown>;
    if (typeof first.msg === 'string') return first.msg;
  }

  return ERROR_FALLBACK;
}

/**
 * Ejecuta la petición y devuelve estado + cuerpo sin lanzar errores por status.
 * La usa la pantalla de verificación de endpoints: necesita ver los 401/403/422
 * esperados y no puede disparar el cierre de sesión global.
 */
export async function apiRequestRaw<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<RawResponse<T>> {
  const { method = 'GET', body, auth = true, signal, query, token } = options;

  const headers: Record<string, string> = { Accept: 'application/json' };

  if (body !== undefined) headers['Content-Type'] = 'application/json';

  if (auth) {
    const sessionToken = resolveToken(token);

    if (!sessionToken) throw new ApiError('No existe una sesión iniciada.', 401);

    headers.Authorization = `Bearer ${sessionToken}`;
  }

  try {
    const response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });

    return { status: response.status, data: await parseBody<T>(response) };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(CONNECTION_ERROR, 0);
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true } = options;

  const { status, data } = await apiRequestRaw<T>(path, options);

  if (status === 401 && auth) {
    clearSession();
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }

  if (status < 200 || status >= 300) {
    throw new ApiError(mensajeDeError(data), status);
  }

  if (status === 204) return undefined as T;

  return data as T;
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'DELETE' }),
};