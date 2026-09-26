import Link from 'next/link';
import Image from 'next/image';
import {
  CircleCheckBig,
  MessageSquareMore,
  Quote,
  ShieldCheck,
  Star,
  TimerReset,
  Trophy,
  Users,
  Verified,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
  const getInitials = (name: string) =>
    name
      .split(' ')
      .filter((part) => part.length > 0)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');

  return (
    <>
      <section className="hero hero-tall card colorful overflow-hidden">
        <div className="grid items-center gap-5 md:grid-cols-2">
          <div>
            <Badge>Trade compliance consulting</Badge>
            <h1>We bridge critical gaps between banks and traders for faster bill regularisation</h1>
            <p>
              Led by Nikhil Goswami, we help export and import businesses structure pending bill portfolios, close
              documentation mismatches, and move AD bank follow-ups toward practical closure.
            </p>
            <div className="row actions">
              <Button asChild variant="outline">
                <Link href="/services">
                  <Users size={16} /> Explore services
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/pricing">
                  <Trophy size={16} /> View engagement plans
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

      <section className="card trust-factors">
        <h2 className="section mt-0">Trust factors</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="trust-factor-card">
            <div className="step-icon">
              <Trophy size={18} />
            </div>
            <p className="trust-stat">5+ years</p>
            <p className="trust-note">Trade compliance consulting experience</p>
          </Card>
          <Card className="trust-factor-card">
            <div className="step-icon">
              <Users size={18} />
            </div>
            <p className="trust-stat">50+ clients</p>
            <p className="trust-note">Handled across export and import workflows</p>
          </Card>
          <Card className="trust-factor-card">
            <div className="step-icon">
              <Verified size={18} />
            </div>
            <p className="trust-stat">Banking + independent</p>
            <p className="trust-note">Practical advisory with execution-focused support</p>
          </Card>
        </div>
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
            <h3 className="h3-sm">Advisory with execution discipline</h3>
            <p className="muted">
              We convert complex pending cases into clear priorities, actions, and accountable follow-up movement.
            </p>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="section">Client testimonials</h2>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {TESTIMONIALS.map((item, index) => (
            <Card key={item.name} className="min-w-[280px] snap-start sm:min-w-[360px]">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-violet-200 bg-violet-100 text-sm font-semibold text-violet-700 dark:border-violet-800 dark:bg-violet-900/50 dark:text-violet-200">
                    {getInitials(item.name)}
                  </span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Client {index + 1}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={`${item.name}-${i}`} size={15} fill="currentColor" />
                  ))}
                </div>
              </div>
              <Quote size={16} className="text-violet-500" />
              <p className="muted">{item.text}</p>
              <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-100">{item.name}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="card consultation-cta text-center">
        <h2>Need a consultation before onboarding?</h2>
        <p className="muted">Share your bill count and get a right-fit execution plan with timeline clarity.</p>
        <div className="row actions justify-center">
          <Button asChild variant="outline">
            <Link href="/pricing">
              <Trophy size={16} /> Review plans
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
