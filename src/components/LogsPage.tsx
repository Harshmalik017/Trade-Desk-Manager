'use client';

import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { seedLogs } from '@/lib/mock-data';
import { rowsToCsv, downloadCsv } from '@/lib/csv';
import { useOnlineStatus } from '@/lib/use-online-status';
import type { ActivityLog } from '@/lib/types';
import { AppDialog } from './AppDialog';
import { EmptyState } from './EmptyState';
import { NoNetworkState } from './NoNetworkState';
import { PageHeader } from './PageHeader';
import { PaginationControls } from './PaginationControls';
import { ViewActionButton } from './ViewActionButton';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const PAGE_SIZE = 10;

export function LogsPage() {
  const online = useOnlineStatus();
  const [page, setPage] = useState(1);
  const [activeLog, setActiveLog] = useState<ActivityLog | null>(null);

  const totalPages = Math.max(1, Math.ceil(seedLogs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = useMemo(
    () => seedLogs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage],
  );

  function exportCsv() {
    const csv = rowsToCsv(seedLogs, [
      { header: 'ID', key: 'id' },
      { header: 'Actor', key: 'actor' },
      { header: 'Action', key: 'action' },
      { header: 'Lane', key: 'lane' },
      { header: 'Status', key: 'status' },
      { header: 'Timestamp', key: 'timestamp' },
    ]);
    downloadCsv('billclear-logs.csv', csv);
  }

  return (
    <>
      <PageHeader
        title="Activity logs"
        subtitle="Audit-friendly stream of admin updates and bill workflow actions."
        action={
          <Button onClick={exportCsv}>
            <Download size={15} /> Export CSV
          </Button>
        }
      />

      {!online && (
        <NoNetworkState
          title="Network unavailable"
          message="You can still review cached mock logs, but export and sync-like actions may not behave as expected."
        />
      )}

      {seedLogs.length === 0 ? (
        <EmptyState title="No activity logs yet" message="Actions performed by admin users will appear here." />
      ) : (
        <>
          <div className="tw clay">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Lane</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((log) => (
                  <tr key={log.id}>
                    <td>{new Date(log.timestamp).toLocaleString('en-IN')}</td>
                    <td>{log.actor}</td>
                    <td>{log.action}</td>
                    <td>{log.lane}</td>
                    <td>
                      <Badge variant="secondary">{log.status}</Badge>
                    </td>
                    <td>
                      <ViewActionButton onClick={() => setActiveLog(log)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <AppDialog open={!!activeLog} title="Log details" onClose={() => setActiveLog(null)}>
        {activeLog ? (
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="font-semibold">Log ID</dt>
              <dd>{activeLog.id}</dd>
            </div>
            <div>
              <dt className="font-semibold">Actor</dt>
              <dd>{activeLog.actor}</dd>
            </div>
            <div>
              <dt className="font-semibold">Action</dt>
              <dd>{activeLog.action}</dd>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="font-semibold">Lane</dt>
                <dd>{activeLog.lane}</dd>
              </div>
              <div>
                <dt className="font-semibold">Status</dt>
                <dd>{activeLog.status}</dd>
              </div>
            </div>
            <div>
              <dt className="font-semibold">Timestamp</dt>
              <dd>{new Date(activeLog.timestamp).toLocaleString('en-IN')}</dd>
            </div>
          </dl>
        ) : null}
      </AppDialog>
    </>
  );
}
