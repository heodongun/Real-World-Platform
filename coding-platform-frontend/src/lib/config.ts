const SERVER_API_BASE_URL =
  process.env.SERVER_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://legendheodongun.com:8080';

const BROWSER_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://legendheodongun.com:8080';

export const resolveApiBaseUrl = () =>
  typeof window === 'undefined' ? SERVER_API_BASE_URL : BROWSER_API_BASE_URL;

export const API_TIMEOUT = 15000;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiErrorPayload {
  error?: string;
  message?: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;

  constructor(message: string, status: number, payload?: ApiErrorPayload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}
