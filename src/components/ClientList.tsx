'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { useDesk } from '@/context/desk-context';
import { rowsToCsv, downloadCsv } from '@/lib/csv';
import { recommendPackage } from '@/lib/packages';
import { useOnlineStatus } from '@/lib/use-online-status';
import type { Client } from '@/lib/types';
import { isOpen } from '@/lib/utils';
import { AppDialog } from './AppDialog';
import { EmptyState } from './EmptyState';
import { NoNetworkState } from './NoNetworkState';
import { PaginationControls } from './PaginationControls';
import { useToast } from './Toast';
import { ViewActionButton } from './ViewActionButton';
import { PageHeader } from './PageHeader';
import { Button } from './ui/button';

export function ClientList() {
  const { clients, bills } = useDesk();
  const toast = useToast();
  const online = useOnlineStatus();
  const [page, setPage] = useState(1);
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(clients.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleClients = useMemo(
    () => clients.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [clients, currentPage],
  );

  function exportCsv() {
    const rows = clients.map((c) => {
      const open = bills.filter((b) => b.clientId === c.id && isOpen(b));
      const ex = open.filter((b) => b.lane === 'EX').length;
      return {
        client: c.name,
        contact: c.contact,
        city: c.city,
        bank: c.bank,
        plan: c.plan,
        exportBills: ex,
        importBills: open.length - ex,
      };
    });
    const csv = rowsToCsv(rows, [
      { header: 'Client', key: 'client' },
      { header: 'Contact', key: 'contact' },
      { header: 'City', key: 'city' },
      { header: 'AD Bank', key: 'bank' },
      { header: 'Current Plan', key: 'plan' },
      { header: 'Export Bills', key: 'exportBills' },
      { header: 'Import Bills', key: 'importBills' },
    ]);
    downloadCsv('billclear-clients.csv', csv);
  }

  return (
    <>
      <PageHeader
        title="Clients"
        subtitle="Every client with their export and import bills kept apart."
        action={<Button onClick={exportCsv}><Download size={15} />Export CSV</Button>}
      />

      <div className="mb-3">
        <Button variant="outline" onClick={() => toast('Add client form arrives in Phase 2')}>
          Add client
        </Button>
      </div>

      {!online && (
        <NoNetworkState
          title="Network unavailable"
          message="Client data is shown in mock mode. New sync actions should be retried after reconnection."
        />
      )}

      {clients.length === 0 ? (
        <EmptyState title="No clients found" message="Add your first client to begin lane-wise bill management." />
      ) : (
        <>
          <div className="tw clay">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>AD bank</th>
                  <th>Export bills</th>
                  <th>Import bills</th>
                  <th>Current plan</th>
                  <th>Suggested</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleClients.map((c) => {
                  const open = bills.filter((b) => b.clientId === c.id && isOpen(b));
                  const ex = open.filter((b) => b.lane === 'EX').length;
                  return (
                    <tr key={c.id}>
                      <td>
                        <Link href={`/clients/${c.id}`}>
                          <b>{c.name}</b>
                        </Link>
                        <br />
                        <small className="muted">
                          {c.contact} · {c.city}
                        </small>
                      </td>
                      <td>{c.bank}</td>
                      <td>{ex}</td>
                      <td>{open.length - ex}</td>
                      <td>{c.plan}</td>
                      <td>
                        <span className="tag">{recommendPackage(open.length).name}</span>
                      </td>
                      <td>
                        <ViewActionButton onClick={() => setActiveClient(c)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <PaginationControls page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <AppDialog open={!!activeClient} title="Client overview" onClose={() => setActiveClient(null)}>
        {activeClient ? (
          <dl className="grid gap-2 text-sm">
            <div>
              <dt className="font-semibold">Client</dt>
              <dd>{activeClient.name}</dd>
            </div>
            <div>
              <dt className="font-semibold">Contact</dt>
              <dd>{activeClient.contact}</dd>
            </div>
            <div>
              <dt className="font-semibold">City</dt>
              <dd>{activeClient.city}</dd>
            </div>
            <div>
              <dt className="font-semibold">AD bank</dt>
              <dd>{activeClient.bank}</dd>
            </div>
            <div>
              <dt className="font-semibold">Plan</dt>
              <dd>{activeClient.plan}</dd>
            </div>
          </dl>
        ) : null}
      </AppDialog>
    </>
  );
}
