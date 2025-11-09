import { ApiError, ApiErrorPayload, resolveApiBaseUrl } from './config';
import {
  AuthResponse,
  DashboardStats,
  ExecuteCodePayload,
  ExecutionResponse,
  LeaderboardEntry,
  LoginPayload,
  Problem,
  RegisterPayload,
  Submission,
  SubmissionPayload,
} from './types';

interface NextFetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

interface ApiFetchOptions extends RequestInit {
  token?: string | null;
  query?: Record<string, string | number | undefined>;
  next?: NextFetchOptions;
}

const buildUrl = (path: string, query?: Record<string, string | number | undefined>) => {
  const base = resolveApiBaseUrl();
  const url = new URL(path.startsWith('http') ? path : `${base}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
};

const parseErrorPayload = async (response: Response): Promise<ApiErrorPayload | undefined> => {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json().catch(() => undefined);
  }
  const text = await response.text().catch(() => '');
  if (!text) return undefined;
  return { message: text };
};

export const apiFetch = async <T>(
  path: string,
  { token, query, headers, next, ...options }: ApiFetchOptions = {},
): Promise<T> => {
  const url = buildUrl(path, query);
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(next ? { next } : {}),
  });

  if (!response.ok) {
    const payload = await parseErrorPayload(response);
    throw new ApiError(payload?.message ?? '요청을 처리하지 못했어요.', response.status, payload);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return (await response.text()) as T;
  }

  return (await response.json()) as T;
};

export const login = (payload: LoginPayload) =>
  apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const register = (payload: RegisterPayload) =>
  apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const requestVerificationCode = (email: string) =>
  apiFetch<{ message: string }>('/api/auth/register/code', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

export const fetchProfile = (token: string) =>
  apiFetch<AuthResponse['user']>('/api/users/me', { token });

export const fetchProblems = () =>
  apiFetch<Problem[]>('/api/problems', {
    next: { revalidate: 30 },
  });

export const fetchProblem = (idOrSlug: string) =>
  apiFetch<Problem>(`/api/problems/${idOrSlug}`, { cache: 'no-store' });

export const fetchDashboardStats = () =>
  apiFetch<DashboardStats>('/api/dashboard/stats', {
    next: { revalidate: 15 },
  });

export const fetchLeaderboard = () =>
  apiFetch<LeaderboardEntry[]>('/api/leaderboard', {
    next: { revalidate: 15 },
  });

export const fetchHealth = () =>
  apiFetch<{ status: string }>('/health', {
    cache: 'no-store',
  });

export const executeCode = (token: string, payload: ExecuteCodePayload) =>
  apiFetch<ExecutionResponse>('/api/execute', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

export const fetchSubmissions = (token: string) =>
  apiFetch<Submission[]>('/api/submissions', {
    token,
    cache: 'no-store',
  });

export const fetchSubmission = (token: string, submissionId: string) =>
  apiFetch<Submission>(`/api/submissions/${submissionId}`, {
    token,
    cache: 'no-store',
  });

export const submitSolution = (token: string, payload: SubmissionPayload) =>
  apiFetch('/api/submissions', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
