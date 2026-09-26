'use client';

import { useState, type FormEvent } from 'react';
import { Archive, ClipboardCopy, PhoneCall } from 'lucide-react';
import { useDesk } from '@/context/desk-context';
import { DOC_CHECKLISTS, STATUS_LABEL, STATUS_ORDER } from '@/lib/constants';
import type { Bill, BillStatus } from '@/lib/types';
import { daysOverdue, docsDone, formatNumber } from '@/lib/utils/utils';
import { DocChecklist } from '@/components/admin/bills/DocChecklist';
import { AppDialog } from '@/components/shared/AppDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { FormField } from '@/components/shared/FormField';
import { useToast } from '@/components/shared/Toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const CHANNELS = ['Phone call', 'Email', 'Bank portal', 'Branch visit'];

/** Clipboard write with a fallback for browsers that block the async API. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(area);
      return ok;
    } catch {
      return false;
    }
  }
}

export function BillDetail({ bill, onArchived }: { bill: Bill; onArchived?: () => void }) {
  const { clientById, setStatus, toggleDoc, logAction } = useDesk();
  const toast = useToast();
  const client = clientById(bill.clientId);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState('');
  const [closeOpen, setCloseOpen] = useState(false);

  function changeStatus(status: BillStatus) {
    if (status === 'CLOSED') {
      setCloseOpen(true);
      return;
    }
    setStatus(bill.id, status);
    toast('Status updated');
  }

  function confirmClose() {
    setStatus(bill.id, 'CLOSED');
    setCloseOpen(false);
    toast('Bill closed and moved to archive');
    onArchived?.();
  }

  function submitFollowUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!note.trim()) {
      setNoteError('Add a short note describing the follow-up.');
      return;
    }
    logAction(`${channel} follow-up on ${bill.ref}: ${note.trim()}`, { lane: bill.lane, status: bill.status });
    setFollowUpOpen(false);
    setNote('');
    setNoteError('');
    toast('Follow-up logged');
  }

  async function copyUpdate() {
    const pending = DOC_CHECKLISTS[bill.lane].filter((_, i) => !bill.docs[i]);
    const overdue = daysOverdue(bill);
    const dueLine =
      overdue > 0
        ? `Overdue by ${overdue} day${overdue === 1 ? '' : 's'} (due ${bill.dueDate}).`
        : `Due on ${bill.dueDate}.`;

    const summary = [
      `Update on ${bill.lane === 'IM' ? 'Bill of Entry' : 'shipping bill'} ${bill.ref}`,
      `Client: ${client?.name ?? '—'} · AD bank: ${client?.bank ?? '—'}`,
      `Counterparty: ${bill.party} · ${bill.ccy} ${formatNumber(bill.amount)}`,
      `Current status: ${STATUS_LABEL[bill.status]}. ${dueLine}`,
      `Documents: ${docsDone(bill)}/${DOC_CHECKLISTS[bill.lane].length} received.`,
      pending.length ? `Pending: ${pending.join(', ')}.` : 'All documents received.',
    ].join('\n');

    const ok = await copyText(summary);
    if (ok) {
      logAction(`Copied client update for ${bill.ref}`, { lane: bill.lane, status: bill.status });
      toast('Client update copied to clipboard');
    } else {
      toast('Could not access the clipboard');
    }
  }

  return (
    <div className="card detail">
      <div className="row spread">
        <h2>
          {bill.ref} · {bill.party}
        </h2>
        <label className="row">
          Status
          <select value={bill.status} onChange={(e) => changeStatus(e.target.value as BillStatus)}>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="note">
        {client?.name} · {client?.bank} · {bill.ccy} {formatNumber(bill.amount)}
      </p>
      <DocChecklist bill={bill} onToggle={(i, v) => toggleDoc(bill.id, i, v)} />
      <div className="row actions">
        <Button onClick={() => setFollowUpOpen(true)}>
          <PhoneCall size={15} /> Log bank follow-up
        </Button>
        <Button variant="outline" onClick={copyUpdate}>
          <ClipboardCopy size={15} /> Copy client update
        </Button>
        <Button variant="outline" onClick={() => setCloseOpen(true)}>
          <Archive size={15} /> Close and archive
        </Button>
      </div>

      <AppDialog open={followUpOpen} title="Log bank follow-up" onClose={() => setFollowUpOpen(false)}>
        <form className="admin-form" onSubmit={submitFollowUp} noValidate>
          <FormField label="Channel">
            <select value={channel} onChange={(e) => setChannel(e.target.value)}>
              {CHANNELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Note" error={noteError} hint="Recorded against this bill in the activity log.">
            <Textarea
              className="follow-up-note"
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setNoteError('');
              }}
              placeholder="Spoke to the AD bank desk; e-BRC expected this week."
            />
          </FormField>
          <div className="admin-form-actions">
            <Button type="button" variant="outline" onClick={() => setFollowUpOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save follow-up</Button>
          </div>
        </form>
      </AppDialog>

      <ConfirmDialog
        open={closeOpen}
        title="Close and archive bill"
        message="This bill will be marked closed and moved into the archive. You can restore it from there later."
        itemName={`${bill.ref} · ${bill.party}`}
        confirmLabel="Close and archive"
        onConfirm={confirmClose}
        onClose={() => setCloseOpen(false)}
      />
    </div>
  );
}
