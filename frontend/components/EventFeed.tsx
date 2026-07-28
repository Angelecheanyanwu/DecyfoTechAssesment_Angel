import type { ClinicEvent } from '@/lib/types';
import { channelForSeverity, CHANNEL_STYLE } from '@/lib/notifications';
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
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
        No events yet. Click &quot;Simulate Event&quot; to get started.
      </div>
    );
  }

  return (
    <ul data-testid="event-feed" className="flex flex-col gap-2">
      {events.map((event) => {
        const Icon = TYPE_ICON[event.type];
        const channel = channelForSeverity(event.severity);
        const style = CHANNEL_STYLE[channel];
        const isNormal = event.severity === 'NORMAL';

        return (
          <li
            key={event.id}
            data-testid="event-item"
            className={`flex items-center gap-3 rounded-xl border p-4 shadow-sm ${
              isNormal ? 'border-border bg-white' : style.card
            }`}
          >
            <div className={`shrink-0 rounded-full p-2 ${isNormal ? 'bg-primary-light/10 text-primary-dark' : style.icon}`}>
              <Icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-body">{TYPE_LABEL[event.type]}</span>
                {!isNormal && (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${style.badge}`}>
                    {event.severity}
                  </span>
                )}
                <span className="text-xs text-subtle">{event.patientRef}</span>
              </div>
              <p className="truncate text-sm text-muted">{event.message}</p>
            </div>
            <span className="shrink-0 text-xs text-subtle">{formatTime(event.createdAt)}</span>
          </li>
        );
      })}
    </ul>
  );
}
