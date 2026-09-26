'use client';

import Link from 'next/link';
import { Gauge } from 'lucide-react';
import { useDesk } from '@/context/desk-context';
import { LANE_LABEL, LANE_SLUG, STATUS_LABEL } from '@/lib/constants';
import { useOnlineStatus } from '@/lib/utils/use-online-status';
import { daysOverdue, formatINR, isOpen } from '@/lib/utils/utils';
import { DueTag } from '@/components/admin/bills/DueTag';
import { EmptyState } from '@/components/shared/EmptyState';
import { KpiCard } from '@/components/admin/dashboard/KpiCard';
import { LaneCard } from '@/components/admin/dashboard/LaneCard';
import { NoNetworkState } from '@/components/shared/NoNetworkState';
import { PageHeader } from '@/components/shared/PageHeader';

export function DashboardView() {
  const { clients, bills, clientById } = useDesk();
  const online = useOnlineStatus();
  const open = bills.filter(isOpen);
  const overdue = open.filter((b) => daysOverdue(b) > 0);
  const followUps = [...open]
    .filter((b) => daysOverdue(b) > -10)
    .sort((a, b) => daysOverdue(b) - daysOverdue(a))
    .slice(0, 6);
  const fees = clients.reduce((sum, c) => sum + c.feeInr, 0);

  return (
    <>
      <PageHeader
        title="Dashboard"
        icon={Gauge}
        action={
          <Link className="btn" href="/admin/pitch">
            Open pitch tool
          </Link>
        }
      />
      <div className="grid g4">
        <KpiCard value={clients.length} label="Active clients" />
        <KpiCard value={open.length} label="Open bills" />
        <KpiCard value={overdue.length} label="Overdue bills" tone="bad" />
        <KpiCard value={formatINR(fees)} label="Monthly fees billed" />
      </div>

      {!online && (
        <NoNetworkState
          title="Network unavailable"
          message="Dashboard metrics are visible from mock state. Sync and remote fetch actions are paused."
        />
      )}

      <h2 className="section">Two lanes, tracked separately</h2>
      <div className="grid g2">
        <LaneCard lane="EX" bills={bills.filter((b) => b.lane === 'EX')} />
        <LaneCard lane="IM" bills={bills.filter((b) => b.lane === 'IM')} />
      </div>

      <h2 className="section">Bank follow-ups for today</h2>
      {followUps.length === 0 ? (
        <EmptyState title="No follow-ups due today" message="Once a bill crosses follow-up criteria, it will appear here." />
      ) : (
        <div className="tw clay">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Lane</th>
                <th>Reference</th>
                <th>Status</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {followUps.map((b) => (
                <tr key={b.id}>
                  <td>
                    <Link href={`/admin/bills/${LANE_SLUG[b.lane]}`}>{clientById(b.clientId)?.name}</Link>
                  </td>
                  <td>
                    <span className={`tag ${b.lane === 'IM' ? 'im' : ''}`}>{LANE_LABEL[b.lane]}</span>
                  </td>
                  <td>{b.ref}</td>
                  <td>{STATUS_LABEL[b.status]}</td>
                  <td>
                    <DueTag bill={b} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
