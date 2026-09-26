'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Download, Plus, Search, Users2 } from 'lucide-react';
import { useDesk } from '@/context/desk-context';
import type { ClientInput } from '@/context/desk-context';
import { rowsToCsv, downloadCsv } from '@/lib/utils/csv';
import { recommendPackage } from '@/lib/data/packages';
import { useOnlineStatus } from '@/lib/utils/use-online-status';
import type { Client } from '@/lib/types';
import { isOpen } from '@/lib/utils/utils';
import { AppDialog } from '@/components/shared/AppDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { NoNetworkState } from '@/components/shared/NoNetworkState';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { RowActions } from '@/components/shared/RowActions';
import { useToast } from '@/components/shared/Toast';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClientFormDialog } from './ClientFormDialog';

const PAGE_SIZE = 10;

export function ClientList() {
  const { clients, bills, createClient, updateClient, deleteClient } = useDesk();
  const toast = useToast();
  const online = useOnlineStatus();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [viewClient, setViewClient] = useState<Client | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [blockedReason, setBlockedReason] = useState<string | undefined>();

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter((c) =>
      [c.name, c.contact, c.city, c.bank, c.plan].some((field) => field.toLowerCase().includes(term)),
    );
  }, [clients, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleClients = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  function openBills(clientId: string) {
    return bills.filter((b) => b.clientId === clientId && isOpen(b));
  }

  function exportCsv() {
    const rows = filtered.map((c) => {
      const open = openBills(c.id);
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

  function submitForm(input: ClientInput) {
    if (editClient) {
      updateClient(editClient.id, input);
      toast('Client updated');
    } else {
      createClient(input);
      toast('Client created');
    }
    setFormOpen(false);
    setEditClient(null);
  }

  function askDelete(client: Client) {
    const attached = bills.filter((b) => b.clientId === client.id).length;
    setBlockedReason(
      attached > 0
        ? `${client.name} still has ${attached} bill${attached === 1 ? '' : 's'}. Remove or reassign them before deleting this client.`
        : undefined,
    );
    setDeleteTarget(client);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const result = deleteClient(deleteTarget.id);
    if (!result.ok) {
      setBlockedReason(result.error);
      return;
    }
    toast('Client deleted');
    setDeleteTarget(null);
  }

  return (
    <>
      <PageHeader
        title="Clients"
        icon={Users2}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={exportCsv}>
              <Download size={15} /> Export CSV
            </Button>
            <Button
              onClick={() => {
                setEditClient(null);
                setFormOpen(true);
              }}
            >
              <Plus size={15} /> Add client
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
            placeholder="Search name, contact, city or bank"
            aria-label="Search clients"
          />
        </span>
        <span className="admin-result-count">
          {filtered.length} of {clients.length} clients
        </span>
      </div>

      {!online && (
        <NoNetworkState
          title="Network unavailable"
          message="Client data is shown in mock mode. New sync actions should be retried after reconnection."
        />
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={clients.length === 0 ? 'No clients found' : 'No clients match this search'}
          message={
            clients.length === 0
              ? 'Add your first client to begin lane-wise bill management.'
              : 'Try a different name, city or bank.'
          }
        />
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleClients.map((c) => {
                  const open = openBills(c.id);
                  const ex = open.filter((b) => b.lane === 'EX').length;
                  return (
                    <tr key={c.id}>
                      <td>
                        <Link href={`/admin/clients/${c.id}`}>
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
                        <RowActions
                          label={c.name}
                          onView={() => setViewClient(c)}
                          onEdit={() => {
                            setEditClient(c);
                            setFormOpen(true);
                          }}
                          onDelete={() => askDelete(c)}
                        />
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

      <AppDialog open={!!viewClient} title="Client overview" onClose={() => setViewClient(null)}>
        {viewClient ? (
          <dl className="grid gap-2 text-sm">
            <div>
              <dt className="font-semibold">Client</dt>
              <dd>{viewClient.name}</dd>
            </div>
            <div>
              <dt className="font-semibold">Contact</dt>
              <dd>{viewClient.contact}</dd>
            </div>
            <div>
              <dt className="font-semibold">City</dt>
              <dd>{viewClient.city}</dd>
            </div>
            <div>
              <dt className="font-semibold">AD bank</dt>
              <dd>{viewClient.bank}</dd>
            </div>
            <div>
              <dt className="font-semibold">Plan</dt>
              <dd>{viewClient.plan}</dd>
            </div>
            <div>
              <dt className="font-semibold">Monthly fee</dt>
              <dd>₹{viewClient.feeInr.toLocaleString('en-IN')}</dd>
            </div>
          </dl>
        ) : null}
      </AppDialog>

      <ClientFormDialog
        open={formOpen}
        client={editClient}
        onSubmit={submitForm}
        onClose={() => {
          setFormOpen(false);
          setEditClient(null);
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete client"
        message="This client will be permanently removed from the desk."
        itemName={deleteTarget?.name}
        blockedReason={blockedReason}
        onConfirm={confirmDelete}
        onClose={() => {
          setDeleteTarget(null);
          setBlockedReason(undefined);
        }}
      />
    </>
  );
}
