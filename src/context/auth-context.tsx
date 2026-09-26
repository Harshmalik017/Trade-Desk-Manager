'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from '@/lib/constants';
import { clearSessionCookie, readSessionCookie, writeSessionCookie } from '@/lib/auth/session';

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

  const syncFromCookie = useCallback(() => {
    setAdminEmail(readSessionCookie()?.email ?? null);
  }, []);

  useEffect(() => {
    syncFromCookie();
    setIsReady(true);

    // Keep tabs in sync when the session is cleared or expires elsewhere.
    window.addEventListener('focus', syncFromCookie);
    const interval = window.setInterval(syncFromCookie, 60_000);
    return () => {
      window.removeEventListener('focus', syncFromCookie);
      window.clearInterval(interval);
    };
  }, [syncFromCookie]);

  const login = useCallback((email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return { ok: false, error: 'Email and password are required.' };
    }

    if (cleanEmail !== DEMO_ADMIN_EMAIL || password !== DEMO_ADMIN_PASSWORD) {
      return { ok: false, error: 'Invalid credentials. Use the demo admin credentials shown below.' };
    }

    writeSessionCookie(cleanEmail);
    setAdminEmail(cleanEmail);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    clearSessionCookie();
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
