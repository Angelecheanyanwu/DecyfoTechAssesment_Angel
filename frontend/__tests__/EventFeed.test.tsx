import { render, screen } from '@testing-library/react';
import EventFeed from '@/components/EventFeed';
import type { ClinicEvent } from '@/lib/types';

const baseEvent: ClinicEvent = {
  id: '1',
  type: 'CHECK_IN',
  patientRef: 'P-1',
  message: 'Patient checked in',
  severity: 'NORMAL',
  createdAt: '2026-07-28T08:01:00.000Z',
};

describe('EventFeed', () => {
  it('shows an empty state when there are no events', () => {
    render(<EventFeed events={[]} />);
    expect(screen.getByText(/no events yet/i)).toBeInTheDocument();
  });

  it('renders one item per event', () => {
    const events: ClinicEvent[] = [
      baseEvent,
      { ...baseEvent, id: '2', type: 'ALERT', severity: 'HIGH', message: 'Vitals critical', patientRef: 'P-2' },
    ];

    render(<EventFeed events={events} />);

    expect(screen.getAllByTestId('event-item')).toHaveLength(2);
    expect(screen.getByText('Patient checked in')).toBeInTheDocument();
    expect(screen.getByText('Vitals critical')).toBeInTheDocument();
  });

  it('marks HIGH severity events with a HIGH badge', () => {
    const events: ClinicEvent[] = [{ ...baseEvent, severity: 'HIGH', type: 'ALERT' }];

    render(<EventFeed events={events} />);

    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('does not show a HIGH badge for NORMAL severity events', () => {
    render(<EventFeed events={[baseEvent]} />);

    expect(screen.queryByText('HIGH')).not.toBeInTheDocument();
  });

  it('marks CRITICAL severity events with a CRITICAL badge', () => {
    const events: ClinicEvent[] = [{ ...baseEvent, severity: 'CRITICAL', type: 'ALERT' }];

    render(<EventFeed events={events} />);

    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
  });
});
