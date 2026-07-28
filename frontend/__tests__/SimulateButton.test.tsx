import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SimulateButton from '@/components/SimulateButton';

describe('SimulateButton', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('POSTs to /api/events/simulate when clicked', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: '1' }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    render(<SimulateButton />);
    fireEvent.click(screen.getByRole('button', { name: /simulate event/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/events/simulate'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('calls onError when the request fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;
    const onError = jest.fn();

    render(<SimulateButton onError={onError} />);
    fireEvent.click(screen.getByRole('button', { name: /simulate event/i }));

    await waitFor(() => expect(onError).toHaveBeenCalledWith('Failed to simulate event'));
  });
});
