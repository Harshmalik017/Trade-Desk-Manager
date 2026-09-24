import Link from 'next/link';
import { PACKAGES, RETAINERS } from '@/lib/packages';
import { formatINR } from '@/lib/utils';
import { PlanCard } from './PlanCard';

const STEPS = [
  {
    title: '1) Intake and lane mapping',
    text: 'Separate export (EDPMS) and import (IDPMS) bills and identify pending actions per lane.',
  },
  {
    title: '2) Reconciliation and document checks',
    text: 'Review invoice, shipping, remittance, and bank-side records against every open bill.',
  },
  {
    title: '3) Follow-up and closure support',
    text: 'Track ageing, coordinate with AD banks, and push cases from docs-pending to closure.',
  },
];

export function LandingPage() {
  return (
    <>
      <section className="hero card">
        <span className="tag">Trade desk workflow</span>
        <h1>Close EDPMS and IDPMS bills faster with one operating desk</h1>
        <p>
          BillClear Desk gives your team a clear dashboard for pending bills, due-date follow-ups, package selection,
          and client-facing proposals.
        </p>
        <div className="row actions">
          <Link href="/admin/login" className="btn">
            Admin login
          </Link>
          <a href="#pricing" className="btn ghost">
            View pricing
          </a>
        </div>
      </section>

      <section>
        <h2 className="section">How the desk runs daily</h2>
        <div className="grid g3">
          {STEPS.map((step) => (
            <div key={step.title} className="card">
              <h3 className="h3-sm">{step.title}</h3>
              <p className="muted">{step.text}</p>
            </div>
          ))}
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
            <div key={retainer.maxBills} className="card plan">
              <small className="muted">Up to {retainer.maxBills} bills</small>
              <div className="price">
                {formatINR(retainer.priceInr)} <small className="muted">/ month</small>
              </div>
              <p className="note">Includes lane-wise tracking, discrepancy support, and periodic follow-up reporting.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card cta">
        <h2>Ready to run the desk live?</h2>
        <p className="muted">Log in as admin to open dashboard, clients, bill tracker, and pitch tools.</p>
        <Link href="/admin/login" className="btn">
          Continue to admin login
        </Link>
      </section>
    </>
  );
}
