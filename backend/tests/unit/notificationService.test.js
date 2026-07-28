const { dispatchNotification, resolveChannel, CHANNELS } = require('../../src/services/notificationService');

describe('notificationService', () => {
  let logSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('resolves NORMAL severity events to the in_app channel', () => {
    const event = { severity: 'NORMAL' };
    expect(resolveChannel(event)).toBe(CHANNELS.IN_APP);
  });

  it('resolves HIGH severity events to the sms channel', () => {
    const event = { severity: 'HIGH' };
    expect(resolveChannel(event)).toBe(CHANNELS.SMS);
  });

  it('logs an in_app push for a NORMAL severity event', () => {
    const event = { id: '1', type: 'CHECK_IN', message: 'hello', severity: 'NORMAL' };

    const result = dispatchNotification(event);

    expect(result.channel).toBe(CHANNELS.IN_APP);
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[notification][in_app]'));
  });

  it('logs a stubbed sms notification for a HIGH severity event, not in_app', () => {
    const event = { id: '2', type: 'ALERT', message: 'urgent', severity: 'HIGH' };

    const result = dispatchNotification(event);

    expect(result.channel).toBe(CHANNELS.SMS);
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[notification][sms][STUB]'));
  });
});
