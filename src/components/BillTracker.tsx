'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useDesk } from '@/context/desk-context';
import { LANE_SLUG, STATUS_LABEL, STATUS_ORDER } from '@/lib/constants';
import type { BillStatus, Lane } from '@/lib/types';
import { docsDone, formatNumber } from '@/lib/utils';
import { BillDetail } from './BillDetail';
import { DueTag } from './DueTag';
import { PageHeader } from './PageHeader';

export function BillTracker({ lane }: { lane: Lane }) {
  const { bills, clientById } = useDesk();
  const [filter, setFilter] = useState<BillStatus | 'ALL'>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const isImport = lane === 'IM';
  const laneBills = bills.filter((b) => b.lane === lane);
  const rows = laneBills.filter((b) => filter === 'ALL' || b.status === filter);
  const selected = laneBills.find((b) => b.id === selectedId);

  return (
    <>
      <PageHeader
        title="Bill tracker"
        subtitle={
          isImport
            ? 'IDPMS: match each Bill of Entry with its outward remittance.'
            : 'EDPMS: match each shipping bill with its export proceeds.'
        }
        action={
          <div className="seg" role="group" aria-label="Lane">
            <Link href="/bills/export" className={!isImport ? 'on' : ''}>
              Export · EDPMS
            </Link>
            <Link href="/bills/import" className={isImport ? 'on' : ''}>
              Import · IDPMS
            </Link>
          </div>
        }
      />

      <div className="chips" role="group" aria-label="Filter by status">
        <button className={`chip ${filter === 'ALL' ? 'on' : ''}`} onClick={() => setFilter('ALL')}>
          All
        </button>
        {STATUS_ORDER.map((s) => (
          <button key={s} className={`chip ${filter === s ? 'on' : ''}`} onClick={() => setFilter(s)}>
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="tw">
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>{isImport ? 'Bill of Entry' : 'Shipping bill'}</th>
              <th>{isImport ? 'Supplier' : 'Buyer'}</th>
              <th>Amount</th>
              <th>{isImport ? 'Remit by' : 'Realise by'}</th>
              <th>Documents</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7}>No bills with this status. Pick another filter.</td>
              </tr>
            )}
            {rows.map((b) => (
              <tr
                key={b.id}
                tabIndex={0}
                className={`clickable ${b.id === selectedId ? 'sel' : ''}`}
                aria-selected={b.id === selectedId}
                onClick={() => setSelectedId(b.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedId(b.id);
                  }
                }}
              >
                <td>{clientById(b.clientId)?.name}</td>
                <td>{b.ref}</td>
                <td>{b.party}</td>
                <td>
                  {b.ccy} {formatNumber(b.amount)}
                </td>
                <td>
                  <DueTag bill={b} />
                </td>
                <td>
                  <div className="prog" title={`${docsDone(b)}/5 documents`}>
                    <i style={{ width: `${docsDone(b) * 20}%` }} />
                  </div>
                </td>
                <td>{STATUS_LABEL[b.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected ? (
        <BillDetail bill={selected} />
      ) : (
        <p className="note">Select a bill to see its document checklist and update its status.</p>
      )}
    </>
  );
}
