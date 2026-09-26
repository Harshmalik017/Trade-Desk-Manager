import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
  variants: {
    variant: {
      default: 'border-transparent bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-200',
      secondary: 'border-transparent bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200',
      outline: 'border-slate-200 bg-transparent text-slate-700 dark:border-slate-700 dark:text-slate-200',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
},
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
