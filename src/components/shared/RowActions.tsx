'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';

interface RowActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  label?: string;
}

export function RowActions({ onView, onEdit, onDelete, label = 'record' }: RowActionsProps) {
  return (
    <div className="row-actions">
      {onView && (
        <button type="button" className="row-action is-view" onClick={onView} aria-label={`View ${label}`} title="View">
          <Eye size={15} />
        </button>
      )}
      {onEdit && (
        <button type="button" className="row-action is-edit" onClick={onEdit} aria-label={`Edit ${label}`} title="Edit">
          <Pencil size={15} />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          className="row-action is-delete"
          onClick={onDelete}
          aria-label={`Delete ${label}`}
          title="Delete"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}
