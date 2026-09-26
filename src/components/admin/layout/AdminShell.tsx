'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { NetworkStatusBanner } from '@/components/shared/NetworkStatusBanner';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';

const COLLAPSE_KEY = 'billclear_admin_sidebar_collapsed';

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(COLLAPSE_KEY) === '1');
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const toggleCollapse = useCallback(() => {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
      return next;
    });
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className={collapsed ? 'admin-layout is-collapsed' : 'admin-layout'}>
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={closeMobile}
      />

      <div className="admin-main">
        <AdminHeader
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
          onOpenMobileNav={() => setMobileOpen(true)}
        />
        <div className="admin-content" id="admin-content">
          <NetworkStatusBanner />
          <div className="admin-content-inner">{children}</div>
          <footer className="admin-status-line">
            <span>BillClear Desk · Admin panel</span>
            <span>Demo data — not connected to production systems</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
