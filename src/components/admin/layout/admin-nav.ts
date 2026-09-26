import {
  Archive,
  Gauge,
  ListChecks,
  PackageOpen,
  Settings,
  Ship,
  Sparkles,
  Users2,
  type LucideIcon,
} from 'lucide-react';

export interface AdminNavItem {
  href: string;
  label: string;
  match: string;
  icon: LucideIcon;
}

export interface AdminNavGroup {
  title: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    title: 'Overview',
    items: [{ href: '/admin/dashboard', label: 'Dashboard', match: '/admin/dashboard', icon: Gauge }],
  },
  {
    title: 'Operations',
    items: [
      { href: '/admin/clients', label: 'Clients', match: '/admin/clients', icon: Users2 },
      { href: '/admin/bills/export', label: 'Export bills', match: '/admin/bills/export', icon: Ship },
      { href: '/admin/bills/import', label: 'Import bills', match: '/admin/bills/import', icon: PackageOpen },
    ],
  },
  {
    title: 'Growth',
    items: [{ href: '/admin/pitch', label: 'Pitch & packages', match: '/admin/pitch', icon: Sparkles }],
  },
  {
    title: 'Records',
    items: [
      { href: '/admin/logs', label: 'Activity logs', match: '/admin/logs', icon: ListChecks },
      { href: '/admin/archive', label: 'Archive', match: '/admin/archive', icon: Archive },
    ],
  },
  {
    title: 'System',
    items: [{ href: '/admin/settings', label: 'Settings', match: '/admin/settings', icon: Settings }],
  },
];

export const ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV.flatMap((group) => group.items);

export function isNavItemActive(pathname: string, match: string): boolean {
  return pathname === match || pathname.startsWith(`${match}/`);
}

/** Longest matching nav item wins so nested routes resolve to their parent section. */
export function findActiveNavItem(pathname: string): AdminNavItem | undefined {
  return ADMIN_NAV_ITEMS.filter((item) => isNavItemActive(pathname, item.match)).sort(
    (a, b) => b.match.length - a.match.length,
  )[0];
}
