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

  it('resolves CRITICAL severity events to the whatsapp channel', () => {
    const event = { severity: 'CRITICAL' };
    expect(resolveChannel(event)).toBe(CHANNELS.WHATSAPP);
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

  it('logs a stubbed whatsapp notification for a CRITICAL severity event', () => {
    const event = { id: '3', type: 'ALERT', message: 'code blue', severity: 'CRITICAL' };

    const result = dispatchNotification(event);

    expect(result.channel).toBe(CHANNELS.WHATSAPP);
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[notification][whatsapp][STUB]'));
  });
});
