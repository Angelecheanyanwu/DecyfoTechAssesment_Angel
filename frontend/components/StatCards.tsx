import type { ClinicEvent } from '@/lib/types';
import { Activity, AlertTriangle, LogIn } from 'lucide-react';

export default function StatCards({ events }: { events: ClinicEvent[] }) {
  const total = events.length;
  const highSeverity = events.filter((e) => e.severity === 'HIGH').length;
  const checkIns = events.filter((e) => e.type === 'CHECK_IN').length;

  const stats = [
    { label: 'Total events', value: total, icon: Activity, tone: 'text-blue-600 bg-blue-50' },
    { label: 'High severity', value: highSeverity, icon: AlertTriangle, tone: 'text-red-600 bg-red-50' },
    { label: 'Check-ins', value: checkIns, icon: LogIn, tone: 'text-green-600 bg-green-50' },
  ];

  return (
    <div data-testid="stat-cards" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map(({ label, value, icon: Icon, tone }) => (
        <div key={label} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className={`rounded-full p-2 ${tone}`}>
            <Icon size={18} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
