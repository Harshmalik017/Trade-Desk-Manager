'use client';

import { useMemo, useState } from 'react';
import { Download, ListChecks, Search, Trash2 } from 'lucide-react';
import { useDesk } from '@/context/desk-context';
import { rowsToCsv, downloadCsv } from '@/lib/utils/csv';
import { LANE_LABEL, STATUS_LABEL, STATUS_ORDER } from '@/lib/constants';
import { useOnlineStatus } from '@/lib/utils/use-online-status';
import type { ActivityLog, BillStatus, Lane } from '@/lib/types';
import { AppDialog } from '@/components/shared/AppDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { NoNetworkState } from '@/components/shared/NoNetworkState';
import { PageHeader } from '@/components/shared/PageHeader';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { ViewActionButton } from '@/components/shared/ViewActionButton';
import { useToast } from '@/components/shared/Toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PAGE_SIZE = 10;

export function LogsPage() {
  const { logs, clearLogs } = useDesk();
  const online = useOnlineStatus();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [laneFilter, setLaneFilter] = useState<Lane | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<BillStatus | 'ALL'>('ALL');
  const [activeLog, setActiveLog] = useState<ActivityLog | null>(null);
  const [clearOpen, setClearOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return logs.filter((log) => {
      if (laneFilter !== 'ALL' && log.lane !== laneFilter) return false;
      if (statusFilter !== 'ALL' && log.status !== statusFilter) return false;
      if (!term) return true;
      return [log.action, log.actor].some((field) => field.toLowerCase().includes(term));
    });
  }, [logs, search, laneFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  function exportCsv() {
    const csv = rowsToCsv(filtered, [
      { header: 'ID', key: 'id' },
      { header: 'Actor', key: 'actor' },
      { header: 'Action', key: 'action' },
      { header: 'Lane', key: 'lane' },
      { header: 'Status', key: 'status' },
      { header: 'Timestamp', key: 'timestamp' },
    ]);
    downloadCsv('billclear-logs.csv', csv);
  }

  function confirmClear() {
    clearLogs();
    setClearOpen(false);
    setPage(1);
    toast('Activity logs cleared');
  }

  return (
    <>
      <PageHeader
        title="Activity logs"
        icon={ListChecks}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={exportCsv}>
              <Download size={15} /> Export CSV
            </Button>
            <Button variant="outline" className="confirm-danger-btn" onClick={() => setClearOpen(true)}>
              <Trash2 size={15} /> Clear logs
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
            placeholder="Search action or actor"
            aria-label="Search logs"
          />
        </span>
        <select
          value={laneFilter}
          onChange={(e) => {
            setLaneFilter(e.target.value as Lane | 'ALL');
            setPage(1);
          }}
          aria-label="Filter by lane"
        >
          <option value="ALL">All lanes</option>
          {(['EX', 'IM'] as Lane[]).map((lane) => (
            <option key={lane} value={lane}>
              {LANE_LABEL[lane]}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as BillStatus | 'ALL');
            setPage(1);
          }}
          aria-label="Filter by status"
        >
          <option value="ALL">All statuses</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <span className="admin-result-count">
          {filtered.length} of {logs.length} entries
        </span>
      </div>

      {!online && (
        <NoNetworkState
          title="Network unavailable"
          message="You can still review cached mock logs, but export and sync-like actions may not behave as expected."
        />
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={logs.length === 0 ? 'No activity logs yet' : 'No logs match these filters'}
          message={
            logs.length === 0
              ? 'Actions performed by admin users will appear here.'
              : 'Clear the search or choose different lane and status filters.'
          }
        />
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
                  <th>Actions</th>
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
                      <Badge variant="secondary">{STATUS_LABEL[log.status]}</Badge>
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
                <dd>{LANE_LABEL[activeLog.lane]}</dd>
              </div>
              <div>
                <dt className="font-semibold">Status</dt>
                <dd>{STATUS_LABEL[activeLog.status]}</dd>
              </div>
            </div>
            <div>
              <dt className="font-semibold">Timestamp</dt>
              <dd>{new Date(activeLog.timestamp).toLocaleString('en-IN')}</dd>
            </div>
          </dl>
        ) : null}
      </AppDialog>

      <ConfirmDialog
        open={clearOpen}
        title="Clear activity logs"
        message="All activity log entries will be removed. New actions will start a fresh log."
        confirmLabel="Clear logs"
        onConfirm={confirmClear}
        onClose={() => setClearOpen(false)}
      />
    </>
  );
}
