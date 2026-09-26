'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ADMIN_LOGIN_PATH } from '@/lib/auth/session';

/**
 * Client-side companion to `middleware.ts`. Middleware already blocks
 * unauthenticated navigation; this gate covers sessions that expire or are
 * cleared while the SPA is open.
 */
export function AdminAuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isReady, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace(`${ADMIN_LOGIN_PATH}?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isReady, pathname, router]);

  if (!isReady || !isAuthenticated) {
    return (
      <div className="admin-gate" role="status" aria-live="polite">
        <span className="admin-gate-spinner" aria-hidden="true" />
        <p>Checking admin session…</p>
      </div>
    );
  }

  return <>{children}</>;
}
