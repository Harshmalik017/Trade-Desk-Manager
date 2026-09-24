import type { ServicePackage } from '@/lib/packages';

export function PlanCard({ pkg, highlight }: { pkg: ServicePackage; highlight: boolean }) {
  return (
    <div className={`card plan ${highlight ? 'rec' : ''}`}>
      {highlight && <span className="badge">Best fit</span>}
      <h3>{pkg.name}</h3>
      <small className="muted">{pkg.scope}</small>
      <div className="price">{pkg.priceLabel}</div>
      <ul>
        {pkg.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </div>
  );
}
