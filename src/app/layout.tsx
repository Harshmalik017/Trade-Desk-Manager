import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { ToastProvider } from '@/components/Toast';
import { AuthProvider } from '@/context/auth-context';
import { DeskProvider } from '@/context/desk-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'BillClear Desk',
  description: 'Client and bill management for EDPMS / IDPMS regularisation, reconciliation and closure support.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router layout; move to next/font on deploy */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            <DeskProvider>
              <AppHeader />
              <main>{children}</main>
            </DeskProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
