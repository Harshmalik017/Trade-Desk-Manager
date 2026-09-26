import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Admin · BillClear Desk',
  robots: { index: false, follow: false },
};

/**
 * Base admin layer. Deliberately free of the public marketing header and
 * footer so admin surfaces never inherit website chrome.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="admin-scope">{children}</div>;
}
