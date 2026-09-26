'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { useDesk } from '@/context/desk-context';
import { downloadCsv, rowsToCsv } from '@/lib/csv';
import { LANE_SLUG, STATUS_LABEL, STATUS_ORDER } from '@/lib/constants';
import { useOnlineStatus } from '@/lib/use-online-status';
import type { BillStatus, Lane } from '@/lib/types';
import { docsDone, formatNumber } from '@/lib/utils';
import { EmptyState } from './EmptyState';
import { BillDetail } from './BillDetail';
import { DueTag } from './DueTag';
import { NoNetworkState } from './NoNetworkState';
import { PageHeader } from './PageHeader';
import { PaginationControls } from './PaginationControls';
import { ViewActionButton } from './ViewActionButton';
import { Button } from './ui/button';

export function BillTracker({ lane }: { lane: Lane }) {
  const { bills, clientById } = useDesk();
  const online = useOnlineStatus();
  const [filter, setFilter] = useState<BillStatus | 'ALL'>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const isImport = lane === 'IM';
  const laneBills = bills.filter((b) => b.lane === lane);
  const filteredRows = laneBills.filter((b) => filter === 'ALL' || b.status === filter);
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = useMemo(
    () => filteredRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredRows, currentPage],
  );
  const selected = laneBills.find((b) => b.id === selectedId);

  function exportCsv() {
    const csvRows = filteredRows.map((b) => ({
      client: clientById(b.clientId)?.name ?? '',
      lane: b.lane,
      reference: b.ref,
      party: b.party,
      currency: b.ccy,
      amount: b.amount,
      dueDate: b.dueDate,
      status: STATUS_LABEL[b.status],
    }));
    const csv = rowsToCsv(csvRows, [
      { header: 'Client', key: 'client' },
      { header: 'Lane', key: 'lane' },
      { header: 'Reference', key: 'reference' },
      { header: 'Party', key: 'party' },
      { header: 'Currency', key: 'currency' },
      { header: 'Amount', key: 'amount' },
      { header: 'Due date', key: 'dueDate' },
      { header: 'Status', key: 'status' },
    ]);
    downloadCsv(`billclear-${isImport ? 'import' : 'export'}-bills.csv`, csv);
  }

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
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download size={14} /> Export CSV
            </Button>
            <div className="seg" role="group" aria-label="Lane">
              <Link href="/bills/export" className={!isImport ? 'on' : ''}>
                Export · EDPMS
              </Link>
              <Link href="/bills/import" className={isImport ? 'on' : ''}>
                Import · IDPMS
              </Link>
            </div>
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

      {!online && (
        <NoNetworkState
          title="Network unavailable"
          message="You can review bill rows and details, but status-sync actions should be retried once online."
        />
      )}

      {filteredRows.length === 0 ? (
        <EmptyState title="No bills for this filter" message="Pick another status filter to view available bill records." />
      ) : (
        <>
          <div className="tw clay">
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => (
                  <tr key={b.id}>
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
                    <td>
                      <ViewActionButton onClick={() => setSelectedId(b.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {selected ? (
        <BillDetail bill={selected} />
      ) : (
        <p className="note">Select a bill to see its document checklist and update its status.</p>
      )}
    </>
  );
}
