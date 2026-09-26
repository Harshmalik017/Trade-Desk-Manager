import type { ServicePackage } from '@/lib/data/packages';
import { CircleCheckBig, Gem, ShieldCheck, Sparkles } from 'lucide-react';

const PACKAGE_ICON: Record<ServicePackage['key'], typeof ShieldCheck> = {
  BASIC: ShieldCheck,
  STANDARD: Gem,
  PREMIUM: Sparkles,
};

export function PlanCard({
  pkg,
  highlight,
  badgeLabel = 'Best fit',
}: {
  pkg: ServicePackage;
  highlight: boolean;
  badgeLabel?: string;
}) {
  const Icon = PACKAGE_ICON[pkg.key];
  return (
    <div
      className={`card plan transition-all hover:-translate-y-0.5 hover:shadow-md ${highlight ? 'rec ring-2 ring-violet-500 dark:ring-violet-400' : ''}`}
    >
      {highlight && <span className="badge">{badgeLabel}</span>}
      <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-200">
        <Icon size={18} />
      </div>
      <h3>{pkg.name}</h3>
      <small className="muted">{pkg.scope}</small>
      <div className="price">{pkg.priceLabel}</div>
      <ul>
        {pkg.features.map((f) => (
          <li key={f} className="mb-1 inline-flex items-start gap-2">
            <CircleCheckBig size={14} className="mt-1 text-emerald-500" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
