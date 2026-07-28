'use client';

import { useEffect } from 'react';
import type { ClinicEvent } from '@/lib/types';
import { BellRing } from 'lucide-react';

export default function Toast({ event, onDismiss }: { event: ClinicEvent; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [event.id, onDismiss]);

  return (
    <div
      data-testid="toast"
      className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg"
    >
      <BellRing size={16} className="text-blue-600" />
      <div>
        <p className="text-sm font-medium text-gray-900">New event</p>
        <p className="text-xs text-gray-500">{event.message}</p>
      </div>
    </div>
  );
}
