'use client';

import { useState } from 'react';
import { simulateEvent } from '@/lib/api';
import { Zap } from 'lucide-react';

export default function SimulateButton({ onError }: { onError?: (message: string) => void }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await simulateEvent();
    } catch {
      onError?.('Failed to simulate event');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
    >
      <Zap size={16} />
      {loading ? 'Simulating…' : 'Simulate Event'}
    </button>
  );
}
