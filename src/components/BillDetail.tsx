'use client';

import { useDesk } from '@/context/desk-context';
import { STATUS_LABEL, STATUS_ORDER } from '@/lib/constants';
import type { Bill, BillStatus } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { DocChecklist } from './DocChecklist';
import { useToast } from './Toast';

export function BillDetail({ bill }: { bill: Bill }) {
  const { clientById, setStatus, toggleDoc } = useDesk();
  const toast = useToast();
  const client = clientById(bill.clientId);

  return (
    <div className="card detail">
      <div className="row spread">
        <h2>
          {bill.ref} · {bill.party}
        </h2>
        <label className="row">
          Status
          <select
            value={bill.status}
            onChange={(e) => {
              setStatus(bill.id, e.target.value as BillStatus);
              toast('Status updated');
            }}
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="note">
        {client?.name} · {client?.bank} · {bill.ccy} {formatNumber(bill.amount)}
      </p>
      <DocChecklist bill={bill} onToggle={(i, v) => toggleDoc(bill.id, i, v)} />
      <div className="row actions">
        <button className="btn" onClick={() => toast('Follow-up logging arrives in Phase 3')}>
          Log bank follow-up
        </button>
        <button className="btn ghost" onClick={() => toast('Client update copy arrives in Phase 3')}>
          Copy client update
        </button>
      </div>
    </div>
  );
}
