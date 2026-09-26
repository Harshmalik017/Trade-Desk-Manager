'use client';

import { useMemo, useState } from 'react';
import { Archive, Download, RotateCcw, Search } from 'lucide-react';
import { useDesk } from '@/context/desk-context';
import { downloadCsv, rowsToCsv } from '@/lib/utils/csv';
import { useOnlineStatus } from '@/lib/utils/use-online-status';
import type { ArchiveRecord } from '@/lib/types';
import { AppDialog } from '@/components/shared/AppDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { NoNetworkState } from '@/components/shared/NoNetworkState';
import { PageHeader } from '@/components/shared/PageHeader';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { RowActions } from '@/components/shared/RowActions';
import { useToast } from '@/components/shared/Toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PAGE_SIZE = 10;

export function ArchivePage() {
  const { archive, restoreArchived, deleteArchived } = useDesk();
  const online = useOnlineStatus();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeRecord, setActiveRecord] = useState<ArchiveRecord | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<ArchiveRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ArchiveRecord | null>(null);
  const [blockedReason, setBlockedReason] = useState<string | undefined>();

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return archive;
    return archive.filter((a) =>
      [a.client, a.reference, a.summary].some((field) => field.toLowerCase().includes(term)),
    );
  }, [archive, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  function exportCsv() {
    const csv = rowsToCsv(filtered, [
      { header: 'ID', key: 'id' },
      { header: 'Client', key: 'client' },
      { header: 'Lane', key: 'lane' },
      { header: 'Reference', key: 'reference' },
      { header: 'Closed On', key: 'closedOn' },
      { header: 'Summary', key: 'summary' },
    ]);
    downloadCsv('billclear-archive.csv', csv);
  }

  function confirmRestore() {
    if (!restoreTarget) return;
    const result = restoreArchived(restoreTarget.id);
    if (!result.ok) {
      setBlockedReason(result.error);
      return;
    }
    toast('Case restored to the active bill list');
    setRestoreTarget(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteArchived(deleteTarget.id);
    toast('Archive record deleted');
    setDeleteTarget(null);
  }

  return (
    <>
      <PageHeader
        title="Archive"
        icon={Archive}
        action={
          <Button variant="outline" onClick={exportCsv}>
            <Download size={15} /> Export CSV
          </Button>
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
            placeholder="Search client, reference or summary"
            aria-label="Search archive"
          />
        </span>
        <span className="admin-result-count">
          {filtered.length} of {archive.length} records
        </span>
      </div>

      {!online && (
        <NoNetworkState
          title="Network unavailable"
          message="Archive records can be reviewed, but syncing and export-like operations may be delayed."
        />
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={archive.length === 0 ? 'Archive is empty' : 'No records match this search'}
          message={
            archive.length === 0
              ? 'Closed bill cases will appear here once marked complete.'
              : 'Try a different client or reference.'
          }
        />
      ) : (
        <>
          <div className="tw clay">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Lane</th>
                  <th>Reference</th>
                  <th>Closed on</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr key={item.id}>
                    <td>{item.client}</td>
                    <td>
                      <span className={`tag ${item.lane === 'IM' ? 'im' : ''}`}>{item.lane}</span>
                    </td>
                    <td>{item.reference}</td>
                    <td>{new Date(item.closedOn).toLocaleDateString('en-IN')}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="row-action is-view"
                          onClick={() => setActiveRecord(item)}
                          aria-label={`View ${item.reference}`}
                          title="View"
                        >
                          <Search size={15} />
                        </button>
                        <button
                          type="button"
                          className="row-action is-restore"
                          onClick={() => setRestoreTarget(item)}
                          aria-label={`Restore ${item.reference}`}
                          title="Restore"
                        >
                          <RotateCcw size={15} />
                        </button>
                        <RowActions label={item.reference} onDelete={() => setDeleteTarget(item)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <AppDialog open={!!activeRecord} title="Archive record" onClose={() => setActiveRecord(null)}>
        {activeRecord ? (
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="font-semibold">Client</dt>
              <dd>{activeRecord.client}</dd>
            </div>
            <div>
              <dt className="font-semibold">Reference</dt>
              <dd>{activeRecord.reference}</dd>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="font-semibold">Lane</dt>
                <dd>{activeRecord.lane}</dd>
              </div>
              <div>
                <dt className="font-semibold">Closed on</dt>
                <dd>{new Date(activeRecord.closedOn).toLocaleDateString('en-IN')}</dd>
              </div>
            </div>
            <div>
              <dt className="font-semibold">Summary</dt>
              <dd>{activeRecord.summary}</dd>
            </div>
          </dl>
        ) : null}
      </AppDialog>

      <ConfirmDialog
        open={!!restoreTarget}
        title="Restore archived case"
        message="This case returns to the active bill list with status 'With bank'."
        itemName={restoreTarget ? `${restoreTarget.reference} · ${restoreTarget.client}` : undefined}
        confirmLabel="Restore"
        blockedReason={blockedReason}
        onConfirm={confirmRestore}
        onClose={() => {
          setRestoreTarget(null);
          setBlockedReason(undefined);
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete archive record"
        message="This record will be permanently removed and cannot be restored."
        itemName={deleteTarget ? `${deleteTarget.reference} · ${deleteTarget.client}` : undefined}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
