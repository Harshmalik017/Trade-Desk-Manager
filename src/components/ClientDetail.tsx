'use client';

import Link from 'next/link';
import { useDesk } from '@/context/desk-context';
import { LANE_LABEL, LANE_SLUG } from '@/lib/constants';
import type { Lane } from '@/lib/types';
import { DueTag } from './DueTag';
import { PageHeader } from './PageHeader';

export function ClientDetail({ id }: { id: string }) {
  const { clientById, bills } = useDesk();
  const client = clientById(id);

  if (!client) {
    return (
      <div className="card">
        <p>This client was not found.</p>
        <Link className="btn" href="/clients">
          Back to clients
        </Link>
      </div>
    );
  }

  const mine = bills.filter((b) => b.clientId === client.id);

  return (
    <>
      <PageHeader
        title={client.name}
        subtitle={`${client.contact} · ${client.city} · ${client.bank} · ${client.plan}`}
        action={
          <Link className="btn" href={`/pitch/${client.id}`}>
            Draft proposal
          </Link>
        }
      />
      <div className="grid g2">
        {(['EX', 'IM'] as Lane[]).map((lane) => {
          const list = mine.filter((b) => b.lane === lane);
          return (
            <div key={lane} className={`card lane ${lane === 'IM' ? 'im' : ''}`}>
              <h3>{LANE_LABEL[lane]}</h3>
              {list.length ? (
                list.map((b) => (
                  <Link key={b.id} href={`/bills/${LANE_SLUG[lane]}`} className="check spread">
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
        <Link href="/clients">Back to all clients</Link>
      </p>
    </>
  );
}
