'use client';

import { useMemo, useRef, useState } from 'react';
import { Copy, MessageCircleMore, Send, Sparkles } from 'lucide-react';
import { useDesk } from '@/context/desk-context';
import { PACKAGES, RETAINERS, recommendPackage, recommendRetainer } from '@/lib/data/packages';
import { buildProposal } from '@/lib/data/proposal';
import { formatINR } from '@/lib/utils/utils';
import { PageHeader } from '@/components/shared/PageHeader';
import { PlanCard } from '@/components/shared/PlanCard';
import { useToast } from '@/components/shared/Toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type PitchChannel = 'WHATSAPP' | 'EMAIL';
type PitchUrgency = 'STANDARD' | 'PRIORITY';

export function PitchBuilder({ initialClientId }: { initialClientId?: string }) {
  const { clients, bills, clientById } = useDesk();
  const toast = useToast();
  const [count, setCount] = useState(12);
  const [clientId, setClientId] = useState(
    initialClientId && clientById(initialClientId) ? initialClientId : clients[0].id,
  );
  const [channel, setChannel] = useState<PitchChannel>('WHATSAPP');
  const [urgency, setUrgency] = useState<PitchUrgency>('STANDARD');
  const [includeTimeline, setIncludeTimeline] = useState(true);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const client = clientById(clientId) ?? clients[0];
  const pkg = recommendPackage(count);
  const retainer = recommendRetainer(count);
  const expectedKickoff = urgency === 'PRIORITY' ? 'Within 24 hours' : 'Within 2 business days';

  const proposal = useMemo(
    () =>
      buildProposal(client, bills.filter((b) => b.clientId === client.id), {
        channel,
        urgency,
        includeTimeline,
      }),
    [bills, channel, client, includeTimeline, urgency],
  );

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

  function copyQuickPitch() {
    const opener = channel === 'EMAIL' ? 'Subject: EDPMS/IDPMS regularisation plan\n\n' : '';
    const quick = [
      opener,
      `${client.name}: ${pkg.name} at ${formatINR(pkg.priceInr)}${pkg.key === 'PREMIUM' ? ' onwards' : ''}.`,
      retainer
        ? `Monthly retainer: ${formatINR(retainer.priceInr)} for up to ${retainer.maxBills} bills.`
        : 'Monthly retainer: custom quote for more than 75 bills.',
      `Kickoff: ${expectedKickoff}.`,
    ].join(' ');
    navigator.clipboard.writeText(quick).then(
      () => toast('Quick pitch copied'),
      () => toast('Could not copy quick pitch'),
    );
  }

  return (
    <>
      <PageHeader title="Pitch & packages" icon={Sparkles} />

      <Card>
        <div className="row spread">
          <h3 className="h3-sm">How many bills need regularising?</h3>
          <Badge variant="secondary">
            <Sparkles size={14} /> Pitch ready
          </Badge>
        </div>
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
      </Card>

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
      <Card>
        <div className="grid g2 pitch-controls">
          <Label>
            Client
            <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Label>
          <Label>
            Message channel
            <select value={channel} onChange={(e) => setChannel(e.target.value as PitchChannel)}>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="EMAIL">Email</option>
            </select>
          </Label>
        </div>

        <div className="row actions">
          <Button variant={urgency === 'STANDARD' ? 'default' : 'outline'} onClick={() => setUrgency('STANDARD')}>
            <MessageCircleMore size={16} /> Standard follow-up
          </Button>
          <Button variant={urgency === 'PRIORITY' ? 'default' : 'outline'} onClick={() => setUrgency('PRIORITY')}>
            <Send size={16} /> Priority pitch
          </Button>
          <label className="check slim">
            <input
              type="checkbox"
              checked={includeTimeline}
              onChange={(e) => setIncludeTimeline(e.target.checked)}
            />
            Include onboarding timeline
          </label>
        </div>

        <div className="pitch-ready card">
          <div className="row spread">
            <b>Pitch snapshot</b>
            <span className="muted">Expected kickoff: {expectedKickoff}</span>
          </div>
          <p className="note">
            {pkg.name} package · {retainer ? `${formatINR(retainer.priceInr)} monthly retainer` : 'Custom retainer'} ·{' '}
            {channel === 'EMAIL' ? 'Email-ready script' : 'WhatsApp-ready script'}
          </p>
        </div>

        <Textarea key={`${clientId}-${channel}-${urgency}-${includeTimeline}`} ref={textRef} defaultValue={proposal} aria-label="Proposal message" />
        <div className="row actions">
          <Button onClick={copy}>
            <Copy size={16} /> Copy full proposal
          </Button>
          <Button variant="outline" onClick={copyQuickPitch}>
            <Copy size={16} /> Copy quick pitch
          </Button>
        </div>
        <p className="note">The proposal is built from this client&apos;s live bill data, so the numbers stay accurate.</p>
      </Card>
    </>
  );
}
