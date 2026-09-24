'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { LogOut, Menu, X } from 'lucide-react';
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (match: string) => (match === '/' ? pathname === '/' : pathname.startsWith(match));
  const showAppNav = isReady && isAuthenticated;
  const navTabs = useMemo(() => (showAppNav ? APP_TABS : WEBSITE_TABS), [showAppNav]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="site-header sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-slate-700/80 dark:bg-slate-950/85">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-3">
        <Link
          href={showAppNav ? '/dashboard' : '/'}
          className="mr-2 text-lg font-bold tracking-tight text-violet-700 dark:text-violet-300"
        >
          BillClear Desk
        </Link>

        <nav aria-label="Main" className="hidden flex-1 items-center gap-1 md:flex">
          {navTabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={
                isActive(t.match)
                  ? 'rounded-md bg-violet-100 px-3 py-2 text-sm font-semibold text-violet-700 dark:bg-violet-900/50 dark:text-violet-200'
                  : 'rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }
              aria-current={isActive(t.match) ? 'page' : undefined}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        {!showAppNav && (
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/admin/login" aria-current={pathname.startsWith('/admin/login') ? 'page' : undefined}>
              Admin login
            </Link>
          </Button>
        )}

        <div className="hidden items-center gap-2 text-xs text-slate-500 md:flex dark:text-slate-300">
          {showAppNav ? (
            <>
              <span className="max-w-[240px] truncate">{adminEmail}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut size={14} /> Logout
              </Button>
            </>
          ) : null}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-main-menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      {mobileOpen && (
        <div
          id="mobile-main-menu"
          className="mx-4 mb-3 rounded-xl border border-slate-200 bg-white p-3 shadow-lg md:hidden dark:border-slate-700 dark:bg-slate-900"
        >
          <nav aria-label="Mobile main menu" className="flex flex-col gap-1">
            {navTabs.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={
                  isActive(t.match)
                    ? 'rounded-md bg-violet-100 px-3 py-2 text-sm font-semibold text-violet-700 dark:bg-violet-900/50 dark:text-violet-200'
                    : 'rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                }
                aria-current={isActive(t.match) ? 'page' : undefined}
              >
                {t.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
            {showAppNav ? (
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs text-slate-500 dark:text-slate-300">{adminEmail}</span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut size={14} /> Logout
                </Button>
              </div>
            ) : (
              <Button asChild className="w-full justify-center">
                <Link href="/admin/login">Admin login</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
