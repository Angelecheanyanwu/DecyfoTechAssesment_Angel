'use client';

import { useEffect } from 'react';
import type { ClinicEvent } from '@/lib/types';
import { channelForSeverity, CHANNEL_LABEL, CHANNEL_STYLE } from '@/lib/notifications';
import { BellRing } from 'lucide-react';

export default function Toast({ event, onDismiss }: { event: ClinicEvent; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [event.id, onDismiss]);

  const channel = channelForSeverity(event.severity);
  const style = CHANNEL_STYLE[channel];

  return (
    <div
      data-testid="toast"
      className={`animate-toast-in flex items-start gap-2 rounded-xl border bg-white px-4 py-3 shadow-lg ${style.card}`}
    >
      <div className={`mt-0.5 rounded-full p-1.5 ${style.icon}`}>
        <BellRing size={14} />
      </div>
      <div>
        <p className="flex items-center gap-1.5 text-sm font-medium text-body">
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
          {CHANNEL_LABEL[channel]}
        </p>
        <p className="text-xs text-muted">{event.message}</p>
      </div>
    </div>
  );
}
