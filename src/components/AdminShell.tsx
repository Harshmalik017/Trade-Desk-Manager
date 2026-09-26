'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Archive, Gauge, ListChecks, Menu, Settings, Users2, WalletCards } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from './ui/button';

const ADMIN_TABS = [
  { href: '/dashboard', label: 'Dashboard', match: '/dashboard', icon: Gauge },
  { href: '/clients', label: 'Clients', match: '/clients', icon: Users2 },
  { href: '/bills/export', label: 'Bill tracker', match: '/bills', icon: WalletCards },
  { href: '/logs', label: 'Logs', match: '/logs', icon: ListChecks },
  { href: '/archive', label: 'Archive', match: '/archive', icon: Archive },
  { href: '/pitch', label: 'Pitch & packages', match: '/pitch', icon: WalletCards },
  { href: '/settings', label: 'Settings', match: '/settings', icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { adminEmail, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (match: string) => (match === '/' ? pathname === '/' : pathname.startsWith(match));

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="grid gap-4 lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-6">
      <aside className="clay hidden rounded-2xl border border-slate-200 bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-900/80 lg:block">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">Admin panel</p>
        <nav className="grid gap-1" aria-label="Admin navigation">
          {ADMIN_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={
                  isActive(tab.match)
                    ? 'inline-flex items-center gap-2 rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white'
                    : 'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-violet-100 dark:text-slate-200 dark:hover:bg-slate-800'
                }
                aria-current={isActive(tab.match) ? 'page' : undefined}
              >
                <Icon size={15} /> {tab.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-700">
          <p className="truncate text-xs text-slate-500 dark:text-slate-300">{adminEmail}</p>
          <Button variant="outline" size="sm" className="mt-2 w-full" onClick={logout}>
            Logout
          </Button>
        </div>
      </aside>

      <section>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mb-4 lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={15} /> Admin menu
        </Button>
        {children}
      </section>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden" role="presentation">
          <aside className="h-full w-[290px] overflow-auto border-r border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">Admin menu</p>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-600 text-sm font-bold text-white"
                onClick={() => setMobileOpen(false)}
                aria-label="Close admin menu"
              >
                X
              </button>
            </div>
            <nav className="grid gap-1" aria-label="Mobile admin navigation">
              {ADMIN_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={
                      isActive(tab.match)
                        ? 'inline-flex items-center gap-2 rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white'
                        : 'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-violet-100 dark:text-slate-200 dark:hover:bg-slate-800'
                    }
                    aria-current={isActive(tab.match) ? 'page' : undefined}
                  >
                    <Icon size={15} /> {tab.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-700">
              <p className="truncate text-xs text-slate-500 dark:text-slate-300">{adminEmail}</p>
              <Button variant="outline" size="sm" className="mt-2 w-full" onClick={logout}>
                Logout
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
