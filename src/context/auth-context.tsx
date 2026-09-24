'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from '@/lib/constants';

const STORAGE_KEY = 'billclear_admin_session';

interface AuthValue {
  isReady: boolean;
  isAuthenticated: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setAdminEmail(stored);
    } finally {
      setIsReady(true);
    }
  }, []);

  const login = useCallback((email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return { ok: false, error: 'Email and password are required.' };
    }

    if (cleanEmail !== DEMO_ADMIN_EMAIL || password !== DEMO_ADMIN_PASSWORD) {
      return { ok: false, error: 'Invalid credentials. Use the demo admin credentials shown below.' };
    }

    localStorage.setItem(STORAGE_KEY, cleanEmail);
    setAdminEmail(cleanEmail);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAdminEmail(null);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      isReady,
      isAuthenticated: !!adminEmail,
      adminEmail,
      login,
      logout,
    }),
    [adminEmail, isReady, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
