'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, ShieldCheck, X } from 'lucide-react';
import { ADMIN_NAV, isNavItemActive } from './admin-nav';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;

    const drawer = drawerRef.current;
    const focusable = drawer?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusable?.[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCloseMobile();
        return;
      }
      if (event.key !== 'Tab' || !focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen, onCloseMobile]);

  const renderNav = (compact: boolean) => (
    <nav className="admin-nav" aria-label="Admin sections">
      {ADMIN_NAV.map((group) => (
        <div key={group.title} className="admin-nav-group">
          <p className="admin-nav-group-title">{compact ? '•' : group.title}</p>
          {group.items.map((item) => {
            const Icon = item.icon;
            const active = isNavItemActive(pathname, item.match);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? 'admin-nav-link is-active' : 'admin-nav-link'}
                aria-current={active ? 'page' : undefined}
                title={compact ? item.label : undefined}
                aria-label={compact ? item.label : undefined}
              >
                <Icon size={17} aria-hidden="true" />
                <span className="admin-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  const brand = (
    <div className="admin-brand">
      <span className="admin-brand-mark" aria-hidden="true">
        <ShieldCheck size={18} />
      </span>
      <span className="admin-brand-text">
        <span className="admin-brand-name">BillClear Desk</span>
        <span className="admin-brand-sub">Admin panel</span>
      </span>
    </div>
  );

  return (
    <>
      <aside className={collapsed ? 'admin-sidebar is-collapsed' : 'admin-sidebar'} data-testid="admin-sidebar">
        {brand}
        {renderNav(collapsed)}
        <button type="button" className="admin-collapse-btn" onClick={onToggleCollapse} aria-pressed={collapsed}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          <span className="admin-nav-label">Collapse menu</span>
        </button>
      </aside>

      {mobileOpen && (
        <div className="admin-drawer-overlay" onClick={onCloseMobile} role="presentation">
          <div
            ref={drawerRef}
            className="admin-sidebar admin-sidebar-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-drawer-top">
              {brand}
              <button type="button" className="admin-drawer-close" onClick={onCloseMobile} aria-label="Close admin menu">
                <X size={16} />
              </button>
            </div>
            {renderNav(false)}
          </div>
        </div>
      )}
    </>
  );
}
