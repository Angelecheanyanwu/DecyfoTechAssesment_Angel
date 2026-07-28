import type { ClinicEvent } from '@/lib/types';
import { Activity, AlertOctagon, AlertTriangle, LogIn } from 'lucide-react';

export default function StatCards({ events }: { events: ClinicEvent[] }) {
  const total = events.length;
  const highSeverity = events.filter((e) => e.severity === 'HIGH').length;
  const critical = events.filter((e) => e.severity === 'CRITICAL').length;
  const checkIns = events.filter((e) => e.type === 'CHECK_IN').length;

  const stats = [
    { label: 'Total events', value: total, icon: Activity, tone: 'text-primary-dark bg-primary-light/10' },
    { label: 'High severity', value: highSeverity, icon: AlertTriangle, tone: 'text-amber-700 bg-amber-100' },
    { label: 'Critical', value: critical, icon: AlertOctagon, tone: 'text-violet-700 bg-violet-100' },
    { label: 'Check-ins', value: checkIns, icon: LogIn, tone: 'text-primary-dark bg-primary-teal/15' },
  ];

  return (
    <div data-testid="stat-cards" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, tone }) => (
        <div key={label} className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
          <div className={`rounded-full p-2 ${tone}`}>
            <Icon size={18} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-body">{value}</p>
            <p className="text-xs text-muted">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
