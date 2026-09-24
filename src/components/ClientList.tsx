'use client';

import Link from 'next/link';
import { useDesk } from '@/context/desk-context';
import { recommendPackage } from '@/lib/packages';
import { isOpen } from '@/lib/utils';
import { useToast } from './Toast';
import { PageHeader } from './PageHeader';

export function ClientList() {
  const { clients, bills } = useDesk();
  const toast = useToast();

  return (
    <>
      <PageHeader
        title="Clients"
        subtitle="Every client with their export and import bills kept apart."
        action={
          <button className="btn ghost" onClick={() => toast('Add client form arrives in Phase 2')}>
            Add client
          </button>
        }
      />
      <div className="tw">
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>AD bank</th>
              <th>Export bills</th>
              <th>Import bills</th>
              <th>Current plan</th>
              <th>Suggested</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => {
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
