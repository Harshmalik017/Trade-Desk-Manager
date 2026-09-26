'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogOut, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { BrandLogo } from './BrandLogo';
import { Button } from './ui/button';

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
  const isAdminSession = isReady && isAuthenticated;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="site-header sticky top-0 z-20 border-b border-white/15 bg-gradient-to-r from-violet-700 via-violet-600 to-cyan-600 shadow-lg">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href={isAdminSession ? '/dashboard' : '/'}
          className="mr-2"
        >
          <BrandLogo />
        </Link>

        {!isAdminSession && (
          <nav aria-label="Main" className="hidden flex-1 items-center gap-1 lg:flex">
            {WEBSITE_TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={
                isActive(t.match)
                  ? 'rounded-md bg-white/25 px-3 py-2 text-sm font-semibold text-white'
                  : 'rounded-md px-3 py-2 text-sm font-medium text-violet-100 transition-colors hover:bg-white/15 hover:text-white'
              }
              aria-current={isActive(t.match) ? 'page' : undefined}
            >
              {t.label}
            </Link>
            ))}
          </nav>
        )}

        {!isAdminSession && (
          <Button asChild size="sm" className="hidden border border-white/30 bg-white/15 text-white hover:bg-white/25 lg:inline-flex">
            <Link href="/admin/login" aria-current={pathname.startsWith('/admin/login') ? 'page' : undefined}>
            Admin login
            </Link>
          </Button>
        )}

        <div className="hidden items-center gap-2 text-xs text-violet-100 lg:flex">
          {isAdminSession ? (
            <>
            <span className="max-w-[240px] truncate">{adminEmail}</span>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/15 hover:text-white" onClick={logout}>
              <LogOut size={14} /> Logout
            </Button>
            </>
          ) : null}
        </div>

        {!isAdminSession && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-auto text-white hover:bg-white/15 hover:text-white lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-main-menu"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        )}
      </div>

      {mobileOpen && !isAdminSession && (
        <div
          id="mobile-main-menu"
          className="mx-4 mb-3 rounded-xl border border-white/20 bg-white/10 p-3 shadow-lg backdrop-blur lg:hidden"
        >
          <nav aria-label="Mobile main menu" className="flex flex-col gap-1">
            {WEBSITE_TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={
                isActive(t.match)
                  ? 'rounded-md bg-white/25 px-3 py-2 text-sm font-semibold text-white'
                  : 'rounded-md px-3 py-2 text-sm font-medium text-violet-100 transition-colors hover:bg-white/15 hover:text-white'
              }
              aria-current={isActive(t.match) ? 'page' : undefined}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <div className="mt-3 border-t border-white/20 pt-3">
          <Button asChild className="w-full justify-center border border-white/30 bg-white/15 text-white hover:bg-white/25">
            <Link href="/admin/login">Admin login</Link>
          </Button>
        </div>
        </div>
      )}
    </header>
  );
}
