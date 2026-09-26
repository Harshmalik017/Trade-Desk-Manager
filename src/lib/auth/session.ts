/**
 * Mock admin session stored in a cookie so `middleware.ts` can guard `/admin/*`
 * before a page renders.
 *
 * Phase 2: replace the cookie payload with a signed/HTTP-only session issued by
 * the backend and verify it server-side. The helpers below are the only seam
 * that needs to change.
 */

export const SESSION_COOKIE = 'billclear_admin_session';
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

export const ADMIN_LOGIN_PATH = '/admin/login';
export const ADMIN_HOME_PATH = '/admin/dashboard';

export interface AdminSession {
  email: string;
  expiresAt: number;
}

export function encodeSession(session: AdminSession): string {
  return encodeURIComponent(JSON.stringify(session));
}

export function parseSession(raw: string | undefined | null): AdminSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<AdminSession>;
    if (!parsed || typeof parsed.email !== 'string' || typeof parsed.expiresAt !== 'number') return null;
    if (parsed.expiresAt <= Date.now()) return null;
    return { email: parsed.email, expiresAt: parsed.expiresAt };
  } catch {
    return null;
  }
}

/** Only allow same-origin admin paths as a post-login redirect target. */
export function safeNextPath(next: string | undefined | null): string {
  if (!next) return ADMIN_HOME_PATH;
  if (!next.startsWith('/admin/') || next.startsWith('//')) return ADMIN_HOME_PATH;
  if (next.startsWith(ADMIN_LOGIN_PATH)) return ADMIN_HOME_PATH;
  return next;
}

export function readSessionCookie(): AdminSession | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((entry) => entry.startsWith(`${SESSION_COOKIE}=`));
  return parseSession(match?.slice(SESSION_COOKIE.length + 1));
}

export function writeSessionCookie(email: string): AdminSession {
  const session: AdminSession = { email, expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000 };
  document.cookie = `${SESSION_COOKIE}=${encodeSession(session)}; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
  return session;
}

export function clearSessionCookie(): void {
  document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
