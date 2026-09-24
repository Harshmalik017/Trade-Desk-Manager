'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/', label: 'Dashboard', match: '/' },
  { href: '/clients', label: 'Clients', match: '/clients' },
  { href: '/bills/export', label: 'Bill tracker', match: '/bills' },
  { href: '/pitch', label: 'Pitch & packages', match: '/pitch' },
];

export function AppHeader() {
  const pathname = usePathname();
  const isActive = (match: string) => (match === '/' ? pathname === '/' : pathname.startsWith(match));

  return (
    <header>
      <div className="logo">BillClear Desk</div>
      <nav aria-label="Main">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={isActive(t.match) ? 'on' : ''}
            aria-current={isActive(t.match) ? 'page' : undefined}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <div className="me">Trade compliance desk · Sept 2026</div>
    </header>
  );
}
