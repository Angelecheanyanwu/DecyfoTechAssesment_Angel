import { render, screen, waitFor, act } from '@testing-library/react';
import Home from '@/app/page';

type Handler = (...args: unknown[]) => void;

const handlers: Record<string, Handler[]> = {};

const fakeSocket = {
  on: (event: string, handler: Handler) => {
    handlers[event] = handlers[event] || [];
    handlers[event].push(handler);
  },
  off: (event: string, handler: Handler) => {
    handlers[event] = (handlers[event] || []).filter((h) => h !== handler);
  },
};

function emit(event: string, ...args: unknown[]) {
  (handlers[event] || []).forEach((h) => h(...args));
}

jest.mock('@/lib/socket', () => ({
  getSocket: () => fakeSocket,
}));

jest.mock('@/lib/api', () => ({
  API_URL: 'http://localhost:4000',
  fetchEvents: jest.fn().mockResolvedValue([]),
  simulateEvent: jest.fn(),
}));

describe('Home page', () => {
  beforeEach(() => {
    Object.keys(handlers).forEach((key) => delete handlers[key]);
  });

  it('loads initial events and shows the empty state', async () => {
    render(<Home />);
    expect(await screen.findByText(/no events yet/i)).toBeInTheDocument();
  });

  it('prepends incoming socket events to the feed and shows a toast', async () => {
    render(<Home />);
    await screen.findByText(/no events yet/i);

    const newEvent = {
      id: '1',
      type: 'ALERT',
      patientRef: 'P-9',
      message: 'Vitals critical',
      severity: 'HIGH',
      createdAt: '2026-07-28T08:00:00.000Z',
    };

    act(() => {
      emit('event:new', newEvent);
    });

    await waitFor(() => {
      expect(screen.getAllByText('Vitals critical').length).toBeGreaterThan(0);
    });
    expect(screen.getByTestId('toast')).toBeInTheDocument();
  });

  it('flips the connection indicator to Live on socket connect', async () => {
    render(<Home />);
    await screen.findByText(/no events yet/i);

    expect(screen.getByText(/connecting/i)).toBeInTheDocument();

    act(() => {
      emit('connect');
    });

    await waitFor(() => expect(screen.getByText(/^live$/i)).toBeInTheDocument());
  });
});
