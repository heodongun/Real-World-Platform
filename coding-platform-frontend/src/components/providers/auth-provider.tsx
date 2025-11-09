'use client';

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { login as loginRequest, register as registerRequest, fetchProfile } from '@/lib/api';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '@/lib/types';

const STORAGE_KEY = 'coding-platform-session';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  refreshProfile: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const persistSession = (session: AuthResponse) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

const clearSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};

const loadSession = (): AuthResponse | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const sessionSnapshot = useMemo(() => loadSession(), []);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!sessionSnapshot?.token) {
      return;
    }
    startTransition(() => {
      setToken(sessionSnapshot.token);
      setUser(sessionSnapshot.user);
    });
  }, [sessionSnapshot]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearSession();
  }, []);

  const hydrate = useCallback((session: AuthResponse) => {
    setToken(session.token);
    setUser(session.user);
    persistSession(session);
    return session.user;
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const session = await loginRequest(payload);
      return hydrate(session);
    },
    [hydrate],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const session = await registerRequest(payload);
      return hydrate(session);
    },
    [hydrate],
  );

  const refreshProfile = useCallback(async () => {
    if (!token) return null;
    try {
      const profile = await fetchProfile(token);
      const session: AuthResponse = { token, user: profile };
      persistSession(session);
      setUser(profile);
      return profile;
    } catch (error) {
      logout();
      throw error;
    }
  }, [logout, token]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading: Boolean(sessionSnapshot?.token) && !token,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [login, logout, refreshProfile, register, sessionSnapshot, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.');
  }
  return context;
};
