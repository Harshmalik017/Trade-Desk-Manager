'use client';

import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { seedArchive } from '@/lib/mock-data';
import { downloadCsv, rowsToCsv } from '@/lib/csv';
import { useOnlineStatus } from '@/lib/use-online-status';
import type { ArchiveRecord } from '@/lib/types';
import { AppDialog } from './AppDialog';
import { EmptyState } from './EmptyState';
import { NoNetworkState } from './NoNetworkState';
import { PageHeader } from './PageHeader';
import { PaginationControls } from './PaginationControls';
import { ViewActionButton } from './ViewActionButton';
import { Button } from './ui/button';

const PAGE_SIZE = 10;

export function ArchivePage() {
  const online = useOnlineStatus();
  const [page, setPage] = useState(1);
  const [activeRecord, setActiveRecord] = useState<ArchiveRecord | null>(null);

  const totalPages = Math.max(1, Math.ceil(seedArchive.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = useMemo(
    () => seedArchive.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage],
  );

  function exportCsv() {
    const csv = rowsToCsv(seedArchive, [
      { header: 'ID', key: 'id' },
      { header: 'Client', key: 'client' },
      { header: 'Lane', key: 'lane' },
      { header: 'Reference', key: 'reference' },
      { header: 'Closed On', key: 'closedOn' },
      { header: 'Summary', key: 'summary' },
    ]);
    downloadCsv('billclear-archive.csv', csv);
  }

  return (
    <>
      <PageHeader
        title="Archive"
        subtitle="Closed and regularised cases retained for reference and audits."
        action={
          <Button onClick={exportCsv}>
            <Download size={15} /> Export CSV
          </Button>
        }
      />

      {!online && (
        <NoNetworkState
          title="Network unavailable"
          message="Archive records can be reviewed, but syncing and export-like operations may be delayed."
        />
      )}

      {seedArchive.length === 0 ? (
        <EmptyState title="Archive is empty" message="Closed bill cases will appear here once marked complete." />
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr key={item.id}>
                    <td>{item.client}</td>
                    <td>{item.lane}</td>
                    <td>{item.reference}</td>
                    <td>{new Date(item.closedOn).toLocaleDateString('en-IN')}</td>
                    <td>
                      <ViewActionButton onClick={() => setActiveRecord(item)} />
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
    </>
  );
}
