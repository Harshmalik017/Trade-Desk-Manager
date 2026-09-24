import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BadgeIndianRupee } from 'lucide-react';
import { PACKAGES, RETAINERS } from '@/lib/packages';
import { formatINR } from '@/lib/utils';
import { PlanCard } from './PlanCard';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function PricingPage() {
  return (
    <>
      <section className="card hero colorful">
        <div className="grid items-center gap-5 md:grid-cols-2">
          <div>
            <Badge variant="secondary">
              <BadgeIndianRupee size={14} /> Pricing plans
            </Badge>
            <h1>Flexible pricing for one-time regularisation and monthly operations</h1>
            <p>
              Pick a package based on bill volume and complexity, then use monthly retainers for consistent tracking
              and bank follow-up support.
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-sm dark:border-slate-700/70 dark:bg-slate-900">
            <Image
              src="/3.png"
              alt="Pricing and package selection visual"
              width={529}
              height={419}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section>
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
        <h2>Need a custom quote for large bill portfolios?</h2>
        <p className="muted">We can structure a hybrid onboarding and retainer plan for your workflow volume.</p>
        <div className="row actions cta-links">
          <Button asChild variant="outline">
            <Link href="/admin/login">Login for dashboard preview</Link>
          </Button>
          <Button asChild>
            <Link href="/connect">
              Request pricing discussion <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
