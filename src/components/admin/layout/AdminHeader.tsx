'use client';

import { LogOut, Menu, PanelLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ADMIN_LOGIN_PATH } from '@/lib/auth/session';
import { findActiveNavItem } from './admin-nav';

interface AdminHeaderProps {
  onOpenMobileNav: () => void;
  onToggleCollapse: () => void;
  collapsed: boolean;
}

export function AdminHeader({ onOpenMobileNav, onToggleCollapse, collapsed }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminEmail, logout } = useAuth();
  const activeItem = findActiveNavItem(pathname);
  const sectionLabel = activeItem?.label ?? 'Admin';
  const isSubPage = !!activeItem && pathname !== activeItem.match;

  function handleLogout() {
    logout();
    router.replace(ADMIN_LOGIN_PATH);
  }

  return (
    <header className="admin-header">
      <button type="button" className="admin-icon-btn admin-mobile-only" onClick={onOpenMobileNav} aria-label="Open admin menu">
        <Menu size={18} />
      </button>
      <button
        type="button"
        className="admin-icon-btn admin-desktop-only"
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-pressed={collapsed}
      >
        <PanelLeft size={18} />
      </button>

      <div className="admin-header-titles">
        <p className="admin-breadcrumb">Admin{isSubPage ? ` · ${sectionLabel}` : ''}</p>
        <h2 className="admin-header-title">{isSubPage ? 'Details' : sectionLabel}</h2>
      </div>

      <div className="admin-header-actions">
        <span className="admin-user" title={adminEmail ?? undefined}>
          <span className="admin-user-avatar" aria-hidden="true">
            {(adminEmail ?? 'A').charAt(0).toUpperCase()}
          </span>
          <span className="admin-user-email">{adminEmail}</span>
        </span>
        <button type="button" className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={15} aria-hidden="true" /> Logout
        </button>
      </div>
    </header>
  );
}
