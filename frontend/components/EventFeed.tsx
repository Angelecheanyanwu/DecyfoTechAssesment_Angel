import type { ClinicEvent } from '@/lib/types';
import { AlertTriangle, LogIn, Stethoscope, CheckCircle2 } from 'lucide-react';

const TYPE_ICON: Record<ClinicEvent['type'], React.ComponentType<{ size?: number }>> = {
  CHECK_IN: LogIn,
  TRIAGE_STARTED: Stethoscope,
  TRIAGE_COMPLETE: CheckCircle2,
  ALERT: AlertTriangle,
};

const TYPE_LABEL: Record<ClinicEvent['type'], string> = {
  CHECK_IN: 'Check-in',
  TRIAGE_STARTED: 'Triage started',
  TRIAGE_COMPLETE: 'Triage complete',
  ALERT: 'Alert',
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function EventFeed({ events }: { events: ClinicEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
        No events yet. Click &quot;Simulate Event&quot; to get started.
      </div>
    );
  }

  return (
    <ul data-testid="event-feed" className="flex flex-col gap-2">
      {events.map((event) => {
        const Icon = TYPE_ICON[event.type];
        const isHigh = event.severity === 'HIGH';
        return (
          <li
            key={event.id}
            data-testid="event-item"
            className={`flex items-center gap-3 rounded-xl border p-4 shadow-sm ${
              isHigh ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
            }`}
          >
            <div className={`shrink-0 rounded-full p-2 ${isHigh ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
              <Icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{TYPE_LABEL[event.type]}</span>
                {isHigh && (
                  <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">HIGH</span>
                )}
                <span className="text-xs text-gray-400">{event.patientRef}</span>
              </div>
              <p className="truncate text-sm text-gray-600">{event.message}</p>
            </div>
            <span className="shrink-0 text-xs text-gray-400">{formatTime(event.createdAt)}</span>
          </li>
        );
      })}
    </ul>
  );
}
