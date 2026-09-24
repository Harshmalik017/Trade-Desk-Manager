import { DEMO_TODAY } from './constants';
import type { Bill } from './types';

const DAY_MS = 86_400_000;
const nf = new Intl.NumberFormat('en-IN');

export const formatNumber = (n: number) => nf.format(n);
export const formatINR = (n: number) => `₹${nf.format(n)}`;

/** Positive = days overdue, negative = days remaining. */
export const daysOverdue = (bill: Bill) =>
  Math.round((DEMO_TODAY.getTime() - new Date(bill.dueDate).getTime()) / DAY_MS);

export const isOpen = (bill: Bill) => bill.status !== 'CLOSED';

export const docsDone = (bill: Bill) => bill.docs.filter(Boolean).length;
