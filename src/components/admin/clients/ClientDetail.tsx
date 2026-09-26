'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Plus, Sparkles, Trash2, Users2 } from 'lucide-react';
import { useDesk, type BillInput, type ClientInput } from '@/context/desk-context';
import { LANE_LABEL, LANE_SLUG } from '@/lib/constants';
import type { Lane } from '@/lib/types';
import { formatINR } from '@/lib/utils/utils';
import { BillFormDialog } from '@/components/admin/bills/BillFormDialog';
import { DueTag } from '@/components/admin/bills/DueTag';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { PageHeader } from '@/components/shared/PageHeader';
import { useToast } from '@/components/shared/Toast';
import { Button } from '@/components/ui/button';
import { ClientFormDialog } from './ClientFormDialog';

export function ClientDetail({ id }: { id: string }) {
  const { clientById, bills, updateClient, deleteClient, createBill } = useDesk();
  const router = useRouter();
  const toast = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [billOpen, setBillOpen] = useState(false);
  const [billLane, setBillLane] = useState<Lane>('EX');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [blockedReason, setBlockedReason] = useState<string | undefined>();

  const client = clientById(id);

  if (!client) {
    return (
      <div className="card">
        <p>This client was not found.</p>
        <Link className="btn" href="/admin/clients">
          Back to clients
        </Link>
      </div>
    );
  }

  const mine = bills.filter((b) => b.clientId === client.id);

  function submitEdit(input: ClientInput) {
    updateClient(client!.id, input);
    toast('Client updated');
    setEditOpen(false);
  }

  function submitBill(input: BillInput) {
    createBill(input);
    toast('Bill created');
    setBillOpen(false);
  }

  function askDelete() {
    setBlockedReason(
      mine.length > 0
        ? `${client!.name} still has ${mine.length} bill${mine.length === 1 ? '' : 's'}. Remove or reassign them before deleting this client.`
        : undefined,
    );
    setDeleteOpen(true);
  }

  function confirmDelete() {
    const result = deleteClient(client!.id);
    if (!result.ok) {
      setBlockedReason(result.error);
      return;
    }
    toast('Client deleted');
    router.replace('/admin/clients');
  }

  return (
    <>
      <PageHeader
        title={client.name}
        icon={Users2}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil size={15} /> Edit
            </Button>
            <Button variant="outline" className="confirm-danger-btn" onClick={askDelete}>
              <Trash2 size={15} /> Delete
            </Button>
            <Button asChild>
              <Link href={`/admin/pitch/${client.id}`}>
                <Sparkles size={15} /> Draft proposal
              </Link>
            </Button>
          </div>
        }
      />

      <div className="card clay client-facts">
        <div>
          <span className="muted">Contact</span>
          <b>{client.contact}</b>
        </div>
        <div>
          <span className="muted">City</span>
          <b>{client.city}</b>
        </div>
        <div>
          <span className="muted">AD bank</span>
          <b>{client.bank}</b>
        </div>
        <div>
          <span className="muted">Plan</span>
          <b>{client.plan}</b>
        </div>
        <div>
          <span className="muted">Monthly fee</span>
          <b>{formatINR(client.feeInr)}</b>
        </div>
      </div>

      <div className="grid g2">
        {(['EX', 'IM'] as Lane[]).map((lane) => {
          const list = mine.filter((b) => b.lane === lane);
          return (
            <div key={lane} className={`card lane ${lane === 'IM' ? 'im' : ''}`}>
              <div className="row spread">
                <h3>{LANE_LABEL[lane]}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBillLane(lane);
                    setBillOpen(true);
                  }}
                >
                  <Plus size={14} /> Add bill
                </Button>
              </div>
              {list.length ? (
                list.map((b) => (
                  <Link key={b.id} href={`/admin/bills/${LANE_SLUG[lane]}`} className="check spread">
                    <span>
                      {b.ref}
                      <br />
                      <small className="muted">{b.party}</small>
                    </span>
                    <DueTag bill={b} />
                  </Link>
                ))
              ) : (
                <p className="note">No bills on this lane yet.</p>
              )}
            </div>
          );
        })}
      </div>

      <p className="note">
        <Link href="/admin/clients" className="inline-flex items-center gap-1">
          <ArrowLeft size={14} /> Back to all clients
        </Link>
      </p>

      <ClientFormDialog open={editOpen} client={client} onSubmit={submitEdit} onClose={() => setEditOpen(false)} />

      <BillFormDialog
        open={billOpen}
        defaultLane={billLane}
        defaultClientId={client.id}
        onSubmit={submitBill}
        onClose={() => setBillOpen(false)}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete client"
        message="This client will be permanently removed from the desk."
        itemName={client.name}
        blockedReason={blockedReason}
        onConfirm={confirmDelete}
        onClose={() => {
          setDeleteOpen(false);
          setBlockedReason(undefined);
        }}
      />
    </>
  );
}
