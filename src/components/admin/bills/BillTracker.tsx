'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Download, PackageOpen, Plus, Search, Ship } from 'lucide-react';
import { useDesk, type BillInput } from '@/context/desk-context';
import { downloadCsv, rowsToCsv } from '@/lib/utils/csv';
import { STATUS_LABEL, STATUS_ORDER } from '@/lib/constants';
import { useOnlineStatus } from '@/lib/utils/use-online-status';
import type { Bill, BillStatus, Lane } from '@/lib/types';
import { docsDone, formatNumber } from '@/lib/utils/utils';
import { EmptyState } from '@/components/shared/EmptyState';
import { BillDetail } from '@/components/admin/bills/BillDetail';
import { BillFormDialog } from '@/components/admin/bills/BillFormDialog';
import { DueTag } from '@/components/admin/bills/DueTag';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { NoNetworkState } from '@/components/shared/NoNetworkState';
import { PageHeader } from '@/components/shared/PageHeader';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { RowActions } from '@/components/shared/RowActions';
import { useToast } from '@/components/shared/Toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PAGE_SIZE = 10;

export function BillTracker({ lane }: { lane: Lane }) {
  const { bills, clientById, createBill, updateBill, deleteBill } = useDesk();
  const online = useOnlineStatus();
  const toast = useToast();
  const [filter, setFilter] = useState<BillStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editBill, setEditBill] = useState<Bill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Bill | null>(null);

  const isImport = lane === 'IM';
  const laneBills = useMemo(() => bills.filter((b) => b.lane === lane), [bills, lane]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return laneBills.filter((b) => {
      if (filter !== 'ALL' && b.status !== filter) return false;
      if (!term) return true;
      const clientName = clientById(b.clientId)?.name ?? '';
      return [b.ref, b.party, clientName].some((field) => field.toLowerCase().includes(term));
    });
  }, [laneBills, filter, search, clientById]);

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

  function submitForm(input: BillInput) {
    if (editBill) {
      updateBill(editBill.id, input);
      toast('Bill updated');
    } else {
      createBill(input);
      toast('Bill created');
    }
    setFormOpen(false);
    setEditBill(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteBill(deleteTarget.id);
    if (selectedId === deleteTarget.id) setSelectedId(null);
    toast('Bill deleted');
    setDeleteTarget(null);
  }

  return (
    <>
      <PageHeader
        title={isImport ? 'Import bills' : 'Export bills'}
        icon={isImport ? PackageOpen : Ship}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download size={14} /> Export CSV
            </Button>
            <div className="seg" role="group" aria-label="Lane">
              <Link href="/admin/bills/export" className={!isImport ? 'on' : ''}>
                Export · EDPMS
              </Link>
              <Link href="/admin/bills/import" className={isImport ? 'on' : ''}>
                Import · IDPMS
              </Link>
            </div>
            <Button
              onClick={() => {
                setEditBill(null);
                setFormOpen(true);
              }}
            >
              <Plus size={15} /> Add bill
            </Button>
          </div>
        }
      />

      <div className="admin-toolbar">
        <span className="admin-search">
          <Search size={15} aria-hidden="true" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={`Search reference, ${isImport ? 'supplier' : 'buyer'} or client`}
            aria-label="Search bills"
          />
        </span>
        <span className="admin-result-count">
          {filteredRows.length} of {laneBills.length} bills
        </span>
      </div>

      <div className="chips" role="group" aria-label="Filter by status">
        <button className={`chip ${filter === 'ALL' ? 'on' : ''}`} onClick={() => setFilter('ALL')}>
          All
        </button>
        {STATUS_ORDER.filter((s) => s !== 'CLOSED').map((s) => (
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
        <EmptyState
          title="No bills to show"
          message={
            laneBills.length === 0
              ? 'Add the first bill on this lane to start tracking it.'
              : 'Pick another status filter or clear the search.'
          }
        />
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
                  <th>Actions</th>
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
                      <RowActions
                        label={b.ref}
                        onView={() => setSelectedId(b.id)}
                        onEdit={() => {
                          setEditBill(b);
                          setFormOpen(true);
                        }}
                        onDelete={() => setDeleteTarget(b)}
                      />
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
        <BillDetail bill={selected} onArchived={() => setSelectedId(null)} />
      ) : (
        <p className="note">Select a bill to see its document checklist and update its status.</p>
      )}

      <BillFormDialog
        open={formOpen}
        bill={editBill}
        defaultLane={lane}
        onSubmit={submitForm}
        onClose={() => {
          setFormOpen(false);
          setEditBill(null);
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete bill"
        message="This bill and its document checklist will be permanently removed."
        itemName={deleteTarget ? `${deleteTarget.ref} · ${deleteTarget.party}` : undefined}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
