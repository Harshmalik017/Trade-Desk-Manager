import Link from 'next/link';
import { ArrowRight, CircleCheckBig, HandCoins, ShieldCheck, TimerReset } from 'lucide-react';
import { PACKAGES, RETAINERS } from '@/lib/packages';
import { formatINR } from '@/lib/utils';
import { PlanCard } from './PlanCard';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

const STEPS = [
  {
    title: '1) Intake and lane mapping',
    text: 'Separate export (EDPMS) and import (IDPMS) bills and identify pending actions per lane.',
    icon: ShieldCheck,
  },
  {
    title: '2) Reconciliation and document checks',
    text: 'Review invoice, shipping, remittance, and bank-side records against every open bill.',
    icon: CircleCheckBig,
  },
  {
    title: '3) Follow-up and closure support',
    text: 'Track ageing, coordinate with AD banks, and push cases from docs-pending to closure.',
    icon: TimerReset,
  },
];

export function LandingPage() {
  return (
    <>
      <section className="hero card">
        <Badge>Trade desk workflow</Badge>
        <h1>Close EDPMS and IDPMS bills faster with one operating desk</h1>
        <p>
          BillClear Desk gives your team a clear dashboard for pending bills, due-date follow-ups, package selection,
          and client-facing proposals.
        </p>
        <div className="row actions">
          <Button asChild>
            <Link href="/admin/login">
              Admin login <ArrowRight size={16} />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <a href="#pricing">
              <HandCoins size={16} /> View pricing
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">
              Dashboard preview <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid g4 pitch-metrics">
        <Card className="kpi">
          <b>2 lanes</b>
          <span>Export and import are always tracked separately</span>
        </Card>
        <Card className="kpi">
          <b>4 statuses</b>
          <span>From docs pending to closure with daily visibility</span>
        </Card>
        <Card className="kpi">
          <b>5 docs</b>
          <span>Checklist-based reconciliation per lane</span>
        </Card>
        <Card className="kpi">
          <b>1-click pitch</b>
          <span>Generate proposal text for WhatsApp and email instantly</span>
        </Card>
      </section>

      <section>
        <h2 className="section">How the desk runs daily</h2>
        <div className="grid g3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.title}>
                <div className="step-icon">
                  <Icon size={18} />
                </div>
                <h3 className="h3-sm">{step.title}</h3>
                <p className="muted">{step.text}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="pricing">
        <h2 className="section">One-time regularisation plans</h2>
        <div className="grid plans">
          {PACKAGES.map((pkg, index) => (
            <PlanCard key={pkg.key} pkg={pkg} highlight={index === 1} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="section">Monthly retainers</h2>
        <div className="grid retainers">
          {RETAINERS.map((retainer) => (
            <Card key={retainer.maxBills} className="plan">
              <small className="muted">Up to {retainer.maxBills} bills</small>
              <div className="price">
                {formatINR(retainer.priceInr)} <small className="muted">/ month</small>
              </div>
              <p className="note">Includes lane-wise tracking, discrepancy support, and periodic follow-up reporting.</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="card cta">
        <h2>Ready to run the desk live?</h2>
        <p className="muted">Log in as admin to open dashboard, clients, bill tracker, and pitch tools.</p>
        <Button asChild variant="outline" className="cta-btn">
          <Link href="/admin/login">
            Continue to admin login <ArrowRight size={16} />
          </Link>
        </Button>
      </section>
    </>
  );
}
