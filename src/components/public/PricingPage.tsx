'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ArrowRight, BadgeIndianRupee, SlidersHorizontal } from 'lucide-react';
import { PACKAGES, RETAINERS, recommendPackage, recommendRetainer } from '@/lib/data/packages';
import { formatINR } from '@/lib/utils/utils';
import { PlanCard } from '@/components/shared/PlanCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function PricingPage() {
  const [billCount, setBillCount] = useState(18);
  const recommendedPackage = useMemo(() => recommendPackage(billCount), [billCount]);
  const recommendedRetainer = useMemo(() => recommendRetainer(billCount), [billCount]);

  return (
    <>
      <section className="card hero hero-tall colorful">
        <div className="grid items-center gap-5 md:grid-cols-2">
          <div>
            <Badge variant="secondary">
              <BadgeIndianRupee size={14} /> Pricing plans
            </Badge>
            <h1>Flexible engagement plans for regularisation and ongoing advisory support</h1>
            <p>
              Choose an engagement based on bill volume and complexity, with optional monthly advisory support for
              continuous tracking and bank follow-up coordination.
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

      <section className="card soft">
        <div className="row spread gap-bottom">
          <h2 className="section mt-0">Interactive package estimator</h2>
          <Badge variant="outline">
            <SlidersHorizontal size={13} /> {billCount} bills
          </Badge>
        </div>
        <p className="muted">
          Move the slider to estimate which package and retainer level align best with your current open bill volume.
        </p>
        <input
          type="range"
          min={1}
          max={90}
          value={billCount}
          onChange={(e) => setBillCount(Number(e.target.value))}
          className="mt-3"
          aria-label="Estimated bill volume"
        />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Card className="bg-white/85 dark:bg-slate-900/70">
            <small className="muted">Recommended one-time package</small>
            <h3 className="h3-sm mt-1">{recommendedPackage.name}</h3>
            <p className="muted">
              {recommendedPackage.scope} · {recommendedPackage.priceLabel}
            </p>
          </Card>
          <Card className="bg-white/85 dark:bg-slate-900/70">
            <small className="muted">Recommended monthly retainer</small>
            <h3 className="h3-sm mt-1">
              {recommendedRetainer ? `${formatINR(recommendedRetainer.priceInr)} / month` : 'Custom quote'}
            </h3>
            <p className="muted">
              {recommendedRetainer
                ? `Up to ${recommendedRetainer.maxBills} bills`
                : 'For 76+ bills, we tailor the support plan to your complexity.'}
            </p>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="section">One-time regularisation plans</h2>
        <div className="grid plans">
          {PACKAGES.map((pkg) => (
            <PlanCard
              key={pkg.key}
              pkg={pkg}
              highlight={pkg.key === recommendedPackage.key}
              badgeLabel={pkg.key === recommendedPackage.key ? 'Recommended' : undefined}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="section">Monthly retainers</h2>
        <div className="grid retainers">
          {RETAINERS.map((retainer) => {
            const isActive = recommendedRetainer?.maxBills === retainer.maxBills;
            return (
              <Card
                key={retainer.maxBills}
                className={`plan transition-all ${isActive ? 'ring-2 ring-violet-500 dark:ring-violet-400' : ''}`}
              >
                {isActive && <span className="badge">Best fit</span>}
                <small className="muted">Up to {retainer.maxBills} bills</small>
                <div className="price">
                  {formatINR(retainer.priceInr)} <small className="muted">/ month</small>
                </div>
                <p className="note">Includes lane-wise tracking, discrepancy support, and periodic follow-up reporting.</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="card cta">
        <h2>Need a custom quote for large bill portfolios?</h2>
        <p className="muted">We can structure a hybrid onboarding and retainer plan for your workflow volume.</p>
        <div className="row actions cta-links">
          <Button asChild variant="outline">
            <Link href="/services">Review services</Link>
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
