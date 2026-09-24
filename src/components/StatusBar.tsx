import { STATUS_LABEL, STATUS_ORDER } from '@/lib/constants';
import type { Bill } from '@/lib/types';

export function StatusBar({ bills }: { bills: Bill[] }) {
  const counts = STATUS_ORDER.map((s) => bills.filter((b) => b.status === s).length);
  const total = bills.length || 1;
  return (
    <>
      <div className="bar" role="img" aria-label={STATUS_ORDER.map((s, i) => `${STATUS_LABEL[s]} ${counts[i]}`).join(', ')}>
        {counts.map((n, i) => (
          <i key={i} className={`s${i}`} style={{ width: `${(n / total) * 100}%` }} />
        ))}
      </div>
      <div className="legend">
        {STATUS_ORDER.map((s, i) => (
          <em key={s} className={`s${i}`}>
            {STATUS_LABEL[s]} {counts[i]}
          </em>
        ))}
      </div>
    </>
  );
}
