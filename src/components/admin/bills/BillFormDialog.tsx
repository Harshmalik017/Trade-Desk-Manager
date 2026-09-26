'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { AppDialog } from '@/components/shared/AppDialog';
import { FormField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDesk, type BillInput } from '@/context/desk-context';
import { DOC_CHECKLISTS, LANE_LABEL, STATUS_LABEL, STATUS_ORDER } from '@/lib/constants';
import type { Bill, BillStatus, Lane } from '@/lib/types';

interface BillFormDialogProps {
  open: boolean;
  /** Omit to create a new bill. */
  bill?: Bill | null;
  defaultLane: Lane;
  defaultClientId?: string;
  onSubmit: (input: BillInput) => void;
  onClose: () => void;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'AED', 'JPY', 'INR'];

type Errors = Partial<Record<keyof BillInput, string>>;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function inDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function BillFormDialog({
  open,
  bill,
  defaultLane,
  defaultClientId,
  onSubmit,
  onClose,
}: BillFormDialogProps) {
  const { clients } = useDesk();
  const [values, setValues] = useState<BillInput | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (bill) {
      const { id: _id, ...rest } = bill;
      setValues({ ...rest, docs: [...bill.docs] });
      return;
    }
    const lane = defaultLane;
    setValues({
      clientId: defaultClientId ?? clients[0]?.id ?? '',
      lane,
      ref: '',
      date: today(),
      party: '',
      ccy: 'USD',
      amount: 0,
      dueDate: inDays(30),
      status: 'DOCS_PENDING',
      docs: DOC_CHECKLISTS[lane].map(() => false),
    });
  }, [open, bill, defaultLane, defaultClientId, clients]);

  if (!values) {
    return <AppDialog open={open} title={bill ? 'Edit bill' : 'Add bill'} onClose={onClose}><p /></AppDialog>;
  }

  function set<K extends keyof BillInput>(key: K, value: BillInput[K]) {
    setValues((prev) => (prev ? { ...prev, [key]: value } : prev));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function setLane(lane: Lane) {
    setValues((prev) =>
      prev ? { ...prev, lane, docs: DOC_CHECKLISTS[lane].map((_, i) => prev.docs[i] ?? false) } : prev,
    );
  }

  function validate(current: BillInput): Errors {
    const next: Errors = {};
    if (!current.clientId) next.clientId = 'Select a client.';
    if (!current.ref.trim()) next.ref = 'Reference number is required.';
    if (!current.party.trim()) next.party = 'Counterparty is required.';
    if (!current.date) next.date = 'Bill date is required.';
    if (!current.dueDate) next.dueDate = 'Due date is required.';
    if (current.date && current.dueDate && current.dueDate < current.date) {
      next.dueDate = 'Due date cannot be before the bill date.';
    }
    if (!Number.isFinite(current.amount) || current.amount <= 0) next.amount = 'Enter an amount greater than zero.';
    return next;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values) return;
    const found = validate(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    onSubmit({
      ...values,
      ref: values.ref.trim(),
      party: values.party.trim(),
      amount: Number(values.amount),
    });
  }

  const isImport = values.lane === 'IM';
  const checklist = DOC_CHECKLISTS[values.lane];

  return (
    <AppDialog open={open} title={bill ? 'Edit bill' : 'Add bill'} onClose={onClose}>
      <form className="admin-form" onSubmit={submit} noValidate>
        <div className="admin-form-row">
          <FormField label="Client" error={errors.clientId}>
            <select value={values.clientId} onChange={(e) => set('clientId', e.target.value)}>
              <option value="">Select a client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Lane" hint="Export and import stay separate throughout.">
            <select value={values.lane} onChange={(e) => setLane(e.target.value as Lane)}>
              {(['EX', 'IM'] as Lane[]).map((lane) => (
                <option key={lane} value={lane}>
                  {LANE_LABEL[lane]}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="admin-form-row">
          <FormField label={isImport ? 'Bill of Entry no.' : 'Shipping bill no.'} error={errors.ref}>
            <Input value={values.ref} onChange={(e) => set('ref', e.target.value)} placeholder={isImport ? 'BE-88214' : 'SB-70412'} />
          </FormField>
          <FormField label={isImport ? 'Supplier' : 'Buyer'} error={errors.party}>
            <Input value={values.party} onChange={(e) => set('party', e.target.value)} placeholder="Global Trade Co" />
          </FormField>
        </div>

        <div className="admin-form-row">
          <FormField label="Currency">
            <select value={values.ccy} onChange={(e) => set('ccy', e.target.value)}>
              {CURRENCIES.map((ccy) => (
                <option key={ccy} value={ccy}>
                  {ccy}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Amount" error={errors.amount}>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={values.amount}
              onChange={(e) => set('amount', e.target.valueAsNumber)}
            />
          </FormField>
        </div>

        <div className="admin-form-row">
          <FormField label="Bill date" error={errors.date}>
            <Input type="date" value={values.date} onChange={(e) => set('date', e.target.value)} />
          </FormField>
          <FormField label={isImport ? 'Remit by' : 'Realise by'} error={errors.dueDate}>
            <Input type="date" value={values.dueDate} onChange={(e) => set('dueDate', e.target.value)} />
          </FormField>
        </div>

        <FormField label="Status">
          <select value={values.status} onChange={(e) => set('status', e.target.value as BillStatus)}>
            {STATUS_ORDER.filter((s) => s !== 'CLOSED').map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </FormField>

        <fieldset className="admin-form-checklist">
          <legend>Documents received</legend>
          {checklist.map((doc, index) => (
            <label key={doc} className="admin-form-check">
              <input
                type="checkbox"
                checked={values.docs[index] ?? false}
                onChange={(e) =>
                  set(
                    'docs',
                    checklist.map((_, i) => (i === index ? e.target.checked : (values.docs[i] ?? false))),
                  )
                }
              />
              <span>{doc}</span>
            </label>
          ))}
        </fieldset>

        <div className="admin-form-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{bill ? 'Save changes' : 'Create bill'}</Button>
        </div>
      </form>
    </AppDialog>
  );
}
