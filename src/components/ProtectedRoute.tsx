'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isReady, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isReady, pathname, router]);

  if (!isReady) {
    return <div className="card">Checking admin session…</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
