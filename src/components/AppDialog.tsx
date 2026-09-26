'use client';

import type { ReactNode } from 'react';

interface AppDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function AppDialog({ open, title, onClose, children }: AppDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" role="presentation">
      <div className="clay max-h-[85vh] w-full max-w-2xl overflow-auto rounded-2xl border border-white/60 bg-white/95 p-5 shadow-2xl dark:border-slate-700/60 dark:bg-slate-900/95">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-600 text-sm font-bold text-white hover:bg-red-500"
            aria-label="Close dialog"
          >
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
