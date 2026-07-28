import { render, screen } from '@testing-library/react';
import StatCards from '@/components/StatCards';
import type { ClinicEvent } from '@/lib/types';

function makeEvent(overrides: Partial<ClinicEvent>): ClinicEvent {
  return {
    id: Math.random().toString(),
    type: 'CHECK_IN',
    patientRef: 'P-1',
    message: 'x',
    severity: 'NORMAL',
    createdAt: '2026-07-28T08:00:00.000Z',
    ...overrides,
  };
}

describe('StatCards', () => {
  it('shows all zero counts for an empty event list', () => {
    render(<StatCards events={[]} />);
    const values = screen.getAllByText('0');
    expect(values).toHaveLength(4);
  });

  it('computes total, high severity, critical, and check-in counts correctly', () => {
    const events = [
      makeEvent({ type: 'CHECK_IN', severity: 'NORMAL' }),
      makeEvent({ type: 'CHECK_IN', severity: 'NORMAL' }),
      makeEvent({ type: 'ALERT', severity: 'HIGH' }),
      makeEvent({ type: 'ALERT', severity: 'CRITICAL' }),
      makeEvent({ type: 'TRIAGE_COMPLETE', severity: 'NORMAL' }),
    ];

    render(<StatCards events={events} />);

    // total=5, high severity=1, critical=1, check-ins=2
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getAllByText('1')).toHaveLength(2);
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
