'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { AppDialog } from '@/components/shared/AppDialog';
import { FormField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ClientInput } from '@/context/desk-context';
import type { Client } from '@/lib/types';

interface ClientFormDialogProps {
  open: boolean;
  /** Omit to create a new client. */
  client?: Client | null;
  onSubmit: (input: ClientInput) => void;
  onClose: () => void;
}

const EMPTY: ClientInput = { name: '', contact: '', city: '', bank: '', plan: 'Basic', feeInr: 4999 };

const PLAN_OPTIONS = ['Basic', 'Standard', 'Premium', 'Retainer · 40 bills', 'Retainer · 60 bills'];

type Errors = Partial<Record<keyof ClientInput, string>>;

export function ClientFormDialog({ open, client, onSubmit, onClose }: ClientFormDialogProps) {
  const [values, setValues] = useState<ClientInput>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setValues(
      client
        ? {
            name: client.name,
            contact: client.contact,
            city: client.city,
            bank: client.bank,
            plan: client.plan,
            feeInr: client.feeInr,
          }
        : EMPTY,
    );
  }, [open, client]);

  function set<K extends keyof ClientInput>(key: K, value: ClientInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = 'Client name is required.';
    if (!values.contact.trim()) next.contact = 'Contact person is required.';
    if (!values.city.trim()) next.city = 'City is required.';
    if (!values.bank.trim()) next.bank = 'AD bank is required.';
    if (!Number.isFinite(values.feeInr) || values.feeInr < 0) next.feeInr = 'Enter a fee of zero or more.';
    return next;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    onSubmit({
      name: values.name.trim(),
      contact: values.contact.trim(),
      city: values.city.trim(),
      bank: values.bank.trim(),
      plan: values.plan,
      feeInr: Number(values.feeInr),
    });
  }

  return (
    <AppDialog open={open} title={client ? 'Edit client' : 'Add client'} onClose={onClose}>
      <form className="admin-form" onSubmit={submit} noValidate>
        <FormField label="Client name" error={errors.name}>
          <Input value={values.name} onChange={(e) => set('name', e.target.value)} placeholder="Sharma Textiles Pvt Ltd" />
        </FormField>
        <div className="admin-form-row">
          <FormField label="Contact person" error={errors.contact}>
            <Input value={values.contact} onChange={(e) => set('contact', e.target.value)} placeholder="Rakesh Sharma" />
          </FormField>
          <FormField label="City" error={errors.city}>
            <Input value={values.city} onChange={(e) => set('city', e.target.value)} placeholder="Panipat" />
          </FormField>
        </div>
        <div className="admin-form-row">
          <FormField label="AD bank" error={errors.bank}>
            <Input value={values.bank} onChange={(e) => set('bank', e.target.value)} placeholder="HDFC Bank" />
          </FormField>
          <FormField label="Plan">
            <select value={values.plan} onChange={(e) => set('plan', e.target.value)}>
              {PLAN_OPTIONS.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <FormField label="Monthly fee (INR)" error={errors.feeInr} hint="Billed to this client every month.">
          <Input
            type="number"
            min={0}
            step={100}
            value={values.feeInr}
            onChange={(e) => set('feeInr', e.target.valueAsNumber)}
          />
        </FormField>
        <div className="admin-form-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{client ? 'Save changes' : 'Create client'}</Button>
        </div>
      </form>
    </AppDialog>
  );
}
