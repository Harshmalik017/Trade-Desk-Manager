import type { Bill } from '@/lib/types';
import { daysOverdue } from '@/lib/utils/utils';

export function DueTag({ bill }: { bill: Bill }) {
  if (bill.status === 'CLOSED') return <span className="tag ok">Closed</span>;
  const d = daysOverdue(bill);
  if (d > 0) return <span className="tag bad">{d}d overdue</span>;
  if (d > -15) return <span className="tag warn">Due in {-d}d</span>;
  return <span className="tag">Due in {-d}d</span>;
}
