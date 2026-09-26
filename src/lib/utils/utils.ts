import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DEMO_TODAY } from '@/lib/constants';
import type { Bill } from '@/lib/types';

const DAY_MS = 86_400_000;
const nf = new Intl.NumberFormat('en-IN');

export const formatNumber = (n: number) => nf.format(n);
export const formatINR = (n: number) => `₹${nf.format(n)}`;

/** Positive = days overdue, negative = days remaining. */
export const daysOverdue = (bill: Bill) =>
  Math.round((DEMO_TODAY.getTime() - new Date(bill.dueDate).getTime()) / DAY_MS);

export const isOpen = (bill: Bill) => bill.status !== 'CLOSED';

export const docsDone = (bill: Bill) => bill.docs.filter(Boolean).length;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
