import Link from 'next/link';
import { ArrowRight, CircleCheckBig, FileSearch2, Handshake, TimerReset } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

const SERVICES = [
  {
    title: 'Bill portfolio audit',
    text: 'End-to-end review of open EDPMS and IDPMS bills with status grouping and next-action clarity.',
    icon: FileSearch2,
  },
  {
    title: 'Reconciliation support',
    text: 'Invoice, shipping, remittance, and bank-side document cross-checking with mismatch notes.',
    icon: CircleCheckBig,
  },
  {
    title: 'Bank follow-up coordination',
    text: 'Structured follow-up scheduling and update notes to move cases from pending to closure support.',
    icon: TimerReset,
  },
  {
    title: 'Client communication packs',
    text: 'Pitch-ready package recommendations and proposal drafts for onboarding and renewal conversations.',
    icon: Handshake,
  },
];

export function ServicesPage() {
  return (
    <>
      <section className="card hero colorful">
        <Badge>Our services</Badge>
        <h1>Execution support for trade-desk regularisation workflows</h1>
        <p>
          We combine domain-first operations with simple dashboards so your team sees what is pending, why it is
          blocked, and what to do next.
        </p>
      </section>

      <section>
        <h2 className="section">Service portfolio</h2>
        <div className="grid g2">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title}>
                <div className="step-icon">
                  <Icon size={18} />
                </div>
                <h3 className="h3-sm">{service.title}</h3>
                <p className="muted">{service.text}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="card cta">
        <h2>Want us to evaluate your current open bills?</h2>
        <p className="muted">Share your bill count and lane breakup to get the right package recommendation.</p>
        <div className="row actions cta-links">
          <Button asChild variant="outline">
            <Link href="/pricing">View pricing plans</Link>
          </Button>
          <Button asChild>
            <Link href="/connect">
              Connect with us <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
