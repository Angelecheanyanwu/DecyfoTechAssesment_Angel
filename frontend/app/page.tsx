'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchEvents } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import type { ClinicEvent } from '@/lib/types';
import EventFeed from '@/components/EventFeed';
import SimulateButton from '@/components/SimulateButton';
import StatCards from '@/components/StatCards';
import Toast from '@/components/Toast';
import Sidebar from '@/components/Sidebar';
import WardOverview from '@/components/WardOverview';

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
    <div className="flex min-h-screen bg-surface">
      <Sidebar />

      <div className="relative flex-1 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ellipse opacity-30 blur-3xl"
        />

        <main className="relative mx-auto flex max-w-5xl flex-col gap-6 p-6 md:p-8">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-body">Dashboard</h1>
              <p className="flex items-center gap-1.5 text-sm text-muted">
                <span
                  className={`h-2 w-2 rounded-full ${connected ? 'animate-pulse-soft bg-primary-teal' : 'bg-subtle'}`}
                />
                {connected ? 'Live' : 'Connecting…'}
              </p>
            </div>
            <SimulateButton onError={setError} />
          </header>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          <StatCards events={events} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <EventFeed events={events} />
            </div>
            <WardOverview />
          </div>
        </main>
      </div>

      <div className="fixed bottom-4 right-4 z-10 flex flex-col gap-2">
        {toasts.map((event) => (
          <Toast key={event.id} event={event} onDismiss={() => dismissToast(event.id)} />
        ))}
      </div>
    </div>
  );
}
