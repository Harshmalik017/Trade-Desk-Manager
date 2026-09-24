'use client';

import { useRef, useState } from 'react';
import { useDesk } from '@/context/desk-context';
import { PACKAGES, RETAINERS, recommendPackage, recommendRetainer } from '@/lib/packages';
import { buildProposal } from '@/lib/proposal';
import { formatINR } from '@/lib/utils';
import { PageHeader } from './PageHeader';
import { PlanCard } from './PlanCard';
import { useToast } from './Toast';

export function PitchBuilder({ initialClientId }: { initialClientId?: string }) {
  const { clients, bills, clientById } = useDesk();
  const toast = useToast();
  const [count, setCount] = useState(12);
  const [clientId, setClientId] = useState(
    initialClientId && clientById(initialClientId) ? initialClientId : clients[0].id,
  );
  const textRef = useRef<HTMLTextAreaElement>(null);

  const client = clientById(clientId) ?? clients[0];
  const pkg = recommendPackage(count);
  const retainer = recommendRetainer(count);
  const proposal = buildProposal(client, bills.filter((b) => b.clientId === client.id));

  async function copy() {
    const text = textRef.current?.value ?? proposal;
    try {
      await navigator.clipboard.writeText(text);
      toast('Proposal copied');
    } catch {
      textRef.current?.select();
      toast('Press Ctrl+C to copy');
    }
  }

  return (
    <>
      <PageHeader
        title="Pitch & packages"
        subtitle="Show a client the right plan for their bill count, then send a proposal in one tap."
      />

      <div className="card">
        <h3 className="h3-sm">How many bills need regularising?</h3>
        <div className="row">
          <input
            type="range"
            min={1}
            max={80}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="grow"
            aria-label="Number of bills"
          />
          <b className="big">{count}</b>
        </div>
        <p>
          One-time cleanup: <b>{pkg.name}</b> from {formatINR(pkg.priceInr)}
          {count > 20 ? ' (final quote after case review)' : ''}. Ongoing monthly work:{' '}
          {retainer ? (
            <>
              <b>{formatINR(retainer.priceInr)}</b> retainer for up to {retainer.maxBills} bills.
            </>
          ) : (
            <b>custom retainer quote above 75 bills.</b>
          )}
        </p>
      </div>

      <div className="grid plans">
        {PACKAGES.map((p) => (
          <PlanCard key={p.key} pkg={p} highlight={p.key === pkg.key} />
        ))}
      </div>

      <h2 className="section">Monthly retainers</h2>
      <div className="grid retainers">
        {RETAINERS.map((r) => (
          <div key={r.maxBills} className={`card plan ${retainer?.maxBills === r.maxBills ? 'rec' : ''}`}>
            <small className="muted">Up to {r.maxBills} bills</small>
            <div className="price">
              {formatINR(r.priceInr)} <small className="muted">/ month</small>
            </div>
          </div>
        ))}
      </div>

      <h2 className="section">Proposal for a client</h2>
      <div className="card">
        <label className="row gap-bottom">
          Client
          <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <textarea key={clientId} ref={textRef} defaultValue={proposal} aria-label="Proposal message" />
        <div className="row actions">
          <button className="btn" onClick={copy}>
            Copy for WhatsApp / email
          </button>
        </div>
        <p className="note">The proposal is built from this client&apos;s live bill data, so the numbers stay accurate.</p>
      </div>
    </>
  );
}
