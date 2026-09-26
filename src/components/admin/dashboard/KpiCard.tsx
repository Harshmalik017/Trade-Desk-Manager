export function KpiCard({ value, label, tone }: { value: string | number; label: string; tone?: 'bad' }) {
  return (
    <div className="card kpi">
      <b style={tone === 'bad' ? { color: 'var(--bad)' } : undefined}>{value}</b>
      <span>{label}</span>
    </div>
  );
}
