import type { ClinicEvent } from './types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchEvents(limit = 50): Promise<ClinicEvent[]> {
  const res = await fetch(`${API_URL}/api/events?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function simulateEvent(): Promise<ClinicEvent> {
  const res = await fetch(`${API_URL}/api/events/simulate`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to simulate event');
  return res.json();
}
