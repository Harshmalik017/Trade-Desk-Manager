import Link from 'next/link';
import {
  ArrowRight,
  CircleCheckBig,
  HandCoins,
  MessageSquareMore,
  ShieldCheck,
  TimerReset,
  Users,
} from 'lucide-react';
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
      <section className="hero card colorful">
        <Badge>Pitch-ready trade desk website</Badge>
        <h1>Close EDPMS and IDPMS bills faster with a colorful, client-ready desk</h1>
        <p>
          BillClear Desk gives your team a modern platform for pending bills, due-date follow-ups, package selection,
          and polished client communication.
        </p>
        <div className="row actions">
          <Button asChild>
            <Link href="/admin/login">
              Admin login <ArrowRight size={16} />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/services">
              <Users size={16} /> Explore services
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/pricing">
              <HandCoins size={16} /> View pricing
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/connect">
              <MessageSquareMore size={16} /> Connect with us
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

      <section>
        <h2 className="section">Why teams choose BillClear Desk</h2>
        <div className="grid g3">
          <Card>
            <h3 className="h3-sm">Clarity across every bill</h3>
            <p className="muted">
              Every bill is tracked from documentation to final closure support, with no mixing of export and import
              lanes.
            </p>
          </Card>
          <Card>
            <h3 className="h3-sm">Founder-led expertise</h3>
            <p className="muted">
              Built by an ex-bank trade desk manager to align with real AD bank workflows and practical follow-up
              cycles.
            </p>
          </Card>
          <Card>
            <h3 className="h3-sm">Pitch and propose quickly</h3>
            <p className="muted">
              Use pricing and pitch flows to send clean package options in minutes via WhatsApp or email.
            </p>
          </Card>
        </div>
      </section>

      <section className="card cta">
        <h2>Explore the complete website</h2>
        <p className="muted">
          Visit About, Our Services, Pricing, and Connect pages, then log in to continue with the admin workflow.
        </p>
        <div className="row actions cta-links">
          <Button asChild variant="outline" className="cta-btn">
            <Link href="/about">About us</Link>
          </Button>
          <Button asChild variant="outline" className="cta-btn">
            <Link href="/services">Our services</Link>
          </Button>
          <Button asChild variant="outline" className="cta-btn">
            <Link href="/pricing">Pricing plans</Link>
          </Button>
          <Button asChild className="cta-btn">
            <Link href="/admin/login">
              Continue to login <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>

      <section className="card soft">
        <h2>Need a call before onboarding?</h2>
        <p className="muted">Share your bill count and we will suggest the right package and execution timeline.</p>
        <Button asChild variant="ghost">
          <Link href="/connect">
            Connect with us <ArrowRight size={16} />
          </Link>
        </Button>
      </section>
    </>
  );
}
