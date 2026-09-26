import { LANE_HINT, LANE_LABEL } from '@/lib/constants';
import type { Bill, Lane } from '@/lib/types';
import { StatusBar } from '@/components/shared/StatusBar';

export function LaneCard({ lane, bills }: { lane: Lane; bills: Bill[] }) {
  return (
    <div className={`card lane ${lane === 'IM' ? 'im' : ''}`}>
      <h3>{LANE_LABEL[lane]}</h3>
      <small>
        {LANE_HINT[lane]} · {bills.length} bills
      </small>
      <StatusBar bills={bills} />
    </div>
  );
}
