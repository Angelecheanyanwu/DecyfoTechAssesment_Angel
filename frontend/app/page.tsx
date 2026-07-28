'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchEvents } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import type { ClinicEvent } from '@/lib/types';
import EventFeed from '@/components/EventFeed';
import SimulateButton from '@/components/SimulateButton';
import StatCards from '@/components/StatCards';
import Toast from '@/components/Toast';

export default function Home() {
  const [events, setEvents] = useState<ClinicEvent[]>([]);
  const [toasts, setToasts] = useState<ClinicEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch(() => setError('Failed to load initial events'));
  }, []);

  useEffect(() => {
    const socket = getSocket();

    function handleConnect() {
      setConnected(true);
    }
    function handleDisconnect() {
      setConnected(false);
    }
    function handleNewEvent(event: ClinicEvent) {
      setEvents((prev) => [event, ...prev]);
      setToasts((prev) => [...prev, event]);
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('event:new', handleNewEvent);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('event:new', handleNewEvent);
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Clinic Patient Flow Monitor</h1>
            <p className="flex items-center gap-1.5 text-sm text-gray-500">
              <span className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-300'}`} />
              {connected ? 'Live' : 'Connecting…'}
            </p>
          </div>
          <SimulateButton onError={setError} />
        </header>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <StatCards events={events} />
        <EventFeed events={events} />
      </div>

      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        {toasts.map((event) => (
          <Toast key={event.id} event={event} onDismiss={() => dismissToast(event.id)} />
        ))}
      </div>
    </div>
  );
}
