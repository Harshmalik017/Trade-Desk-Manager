import * as React from 'react';
import { cn } from '@/lib/utils/utils';

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('text-sm font-medium leading-none text-slate-800 dark:text-slate-100', className)} {...props} />;
}
