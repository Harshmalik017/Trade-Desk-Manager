'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from './ui/button';

const APP_TABS = [
  { href: '/dashboard', label: 'Dashboard', match: '/dashboard' },
  { href: '/clients', label: 'Clients', match: '/clients' },
  { href: '/bills/export', label: 'Bill tracker', match: '/bills' },
  { href: '/pitch', label: 'Pitch & packages', match: '/pitch' },
];

const WEBSITE_TABS = [
  { href: '/', label: 'Home', match: '/' },
  { href: '/about', label: 'About', match: '/about' },
  { href: '/services', label: 'Our services', match: '/services' },
  { href: '/pricing', label: 'Pricing', match: '/pricing' },
  { href: '/connect', label: 'Connect with us', match: '/connect' },
];

export function AppHeader() {
  const pathname = usePathname();
  const { isReady, isAuthenticated, adminEmail, logout } = useAuth();
  const isActive = (match: string) => (match === '/' ? pathname === '/' : pathname.startsWith(match));
  const showAppNav = isReady && isAuthenticated;

  return (
    <header>
      <Link href={showAppNav ? '/dashboard' : '/'} className="logo">
        BillClear Desk
      </Link>
      <nav aria-label="Main">
        {showAppNav
          ? APP_TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={isActive(t.match) ? 'on' : ''}
                aria-current={isActive(t.match) ? 'page' : undefined}
              >
                {t.label}
              </Link>
            ))
          : (
            WEBSITE_TABS.map((t) => (
              <Link key={t.href} href={t.href} className={isActive(t.match) ? 'on' : ''}>
                {t.label}
              </Link>
            ))
          )}
      </nav>
      {!showAppNav && (
        <Button asChild size="sm">
          <Link href="/admin/login" aria-current={pathname.startsWith('/admin/login') ? 'page' : undefined}>
            Login
          </Link>
        </Button>
      )}
      <div className="me">
        {showAppNav ? (
          <>
            <span>{adminEmail}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut size={14} /> Logout
            </Button>
          </>
        ) : (
          <span>Trade compliance desk · Sept 2026</span>
        )}
      </div>
    </header>
  );
}
