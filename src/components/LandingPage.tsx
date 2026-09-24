import Link from 'next/link';
import Image from 'next/image';
import {
  CircleCheckBig,
  HandCoins,
  MessageSquareMore,
  Quote,
  ShieldCheck,
  Star,
  TimerReset,
  Trophy,
  Users,
  Verified,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

const STEPS = [
  {
    title: '1) Intake and lane mapping',
    text: 'Separate export (EDPMS) and import (IDPMS) bills and identify pending actions per lane.',
    icon: ShieldCheck,
    tone: 'from-cyan-100 to-cyan-50 dark:from-cyan-900/40 dark:to-cyan-900/20',
  },
  {
    title: '2) Reconciliation and document checks',
    text: 'Review invoice, shipping, remittance, and bank-side records against every open bill.',
    icon: CircleCheckBig,
    tone: 'from-violet-100 to-violet-50 dark:from-violet-900/40 dark:to-violet-900/20',
  },
  {
    title: '3) Follow-up and closure support',
    text: 'Track ageing, coordinate with AD banks, and push cases from docs-pending to closure.',
    icon: TimerReset,
    tone: 'from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-900/20',
  },
];

const TESTIMONIALS = [
  {
    name: 'CFO, Engineering Export House',
    rating: 5,
    text: 'Their follow-up discipline and document mapping reduced our long-pending export bill backlog drastically.',
  },
  {
    name: 'Director, Specialty Chemicals Importer',
    rating: 5,
    text: 'Clear lane-wise tracking and practical advisory gave us confidence with every bank interaction.',
  },
  {
    name: 'Finance Head, Textile Group',
    rating: 5,
    text: 'The team helped us structure pending cases and move them ahead with sharp, actionable updates.',
  },
];

export function LandingPage() {
  return (
    <>
      <section className="hero card colorful overflow-hidden">
        <div className="grid items-center gap-5 md:grid-cols-2">
          <div>
            <Badge>Pitch-ready trade desk website</Badge>
            <h1>Close EDPMS and IDPMS bills faster with a colorful, client-ready desk</h1>
            <p>
              BillClear Desk gives your team a modern platform for pending bills, due-date follow-ups, package
              selection, and polished client communication.
            </p>
            <div className="row actions">
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
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-sm dark:border-slate-700/70 dark:bg-slate-900">
            <Image
              src="/1.png"
              alt="BillClear Desk dashboard and trade-compliance operations preview"
              width={664}
              height={395}
              className="h-full w-full object-cover"
              priority
            />
          </div>
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
          <b>Fast onboarding</b>
          <span>Recommend the right package and move from discovery to execution quickly</span>
        </Card>
      </section>

      <section>
        <h2 className="section">How the desk runs daily</h2>
        <div className="grid g3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className={`bg-gradient-to-br ${step.tone}`}>
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
        <h2 className="section">Why choose Us</h2>
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
              Use structured pricing and package workflows to align internal teams and speed up onboarding.
            </p>
          </Card>
        </div>
      </section>

      <section className="card soft">
        <h2 className="section mt-0">Trust factors</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <div className="step-icon">
              <Trophy size={18} />
            </div>
            <h3 className="h3-sm">5+ years experience</h3>
            <p className="muted">Focused trade-compliance and bill regularisation support across banking workflows.</p>
          </Card>
          <Card>
            <div className="step-icon">
              <Users size={18} />
            </div>
            <h3 className="h3-sm">50+ clients handled</h3>
            <p className="muted">Supported exporters and importers through structured closure-oriented engagement.</p>
          </Card>
          <Card>
            <div className="step-icon">
              <Verified size={18} />
            </div>
            <h3 className="h3-sm">Banking + independent consultant background</h3>
            <p className="muted">Combines institutional process depth with founder-led consulting agility.</p>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="section">Client testimonials</h2>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {TESTIMONIALS.map((item) => (
            <Card key={item.name} className="min-w-[280px] snap-start sm:min-w-[360px]">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={`${item.name}-${i}`} size={15} fill="currentColor" />
                  ))}
                </div>
                <Quote size={16} className="text-violet-500" />
              </div>
              <p className="muted">{item.text}</p>
              <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">{item.name}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="card soft">
        <h2>Need a consultation before onboarding?</h2>
        <p className="muted">Share your bill count and get a right-fit execution plan with timeline clarity.</p>
        <div className="row actions">
          <Button asChild variant="outline">
            <Link href="/pricing">
              <HandCoins size={16} /> Review pricing
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/connect">
              <MessageSquareMore size={16} /> Connect with us
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
