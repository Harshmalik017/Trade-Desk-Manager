import type { ReactNode } from 'react';
import { AppFooter } from '@/components/public/AppFooter';
import { AppHeader } from '@/components/public/AppHeader';
import { NetworkStatusBanner } from '@/components/shared/NetworkStatusBanner';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="public-scope">
      <AppHeader />
      <NetworkStatusBanner />
      <main>
        <div className="site-main-shell">{children}</div>
      </main>
      <AppFooter />
    </div>
  );
}
