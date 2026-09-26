'use client';

import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({ label, error, hint, children }: FormFieldProps) {
  return (
    <label className="ui-label form-field">
      <span className="form-field-label">{label}</span>
      {children}
      {error ? (
        <span className="form-field-error">{error}</span>
      ) : (
        hint && <span className="form-field-hint">{hint}</span>
      )}
    </label>
  );
}
