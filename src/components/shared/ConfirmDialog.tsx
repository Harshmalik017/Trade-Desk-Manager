'use client';

import { AlertTriangle } from 'lucide-react';
import { AppDialog } from '@/components/shared/AppDialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  itemName?: string;
  confirmLabel?: string;
  /** Set when the action cannot proceed; the confirm button is then hidden. */
  blockedReason?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  itemName,
  confirmLabel = 'Delete',
  blockedReason,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <AppDialog open={open} title={title} onClose={onClose}>
      <div className="confirm-body">
        <span className={blockedReason ? 'confirm-icon is-blocked' : 'confirm-icon'} aria-hidden="true">
          <AlertTriangle size={20} />
        </span>
        <div>
          <p className="confirm-message">{blockedReason ?? message}</p>
          {itemName && !blockedReason && <p className="confirm-item">{itemName}</p>}
        </div>
      </div>
      <div className="confirm-actions">
        <Button variant="outline" onClick={onClose}>
          {blockedReason ? 'Close' : 'Cancel'}
        </Button>
        {!blockedReason && (
          <Button className="confirm-danger-btn" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        )}
      </div>
    </AppDialog>
  );
}
