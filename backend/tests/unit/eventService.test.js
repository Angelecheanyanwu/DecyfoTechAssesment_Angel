jest.mock('../../src/prisma', () => ({
  event: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
}));
jest.mock('../../src/services/notificationService', () => ({
  dispatchNotification: jest.fn(),
}));

const prisma = require('../../src/prisma');
const { dispatchNotification } = require('../../src/services/notificationService');
const { createEventService } = require('../../src/services/eventService');

describe('eventService', () => {
  let io;
  let eventService;

  beforeEach(() => {
    jest.clearAllMocks();
    io = { emit: jest.fn() };
    eventService = createEventService({ io });
  });

  describe('createEvent', () => {
    it('writes to the DB, emits event:new over the socket, and dispatches a notification', async () => {
      const input = { type: 'CHECK_IN', patientRef: 'P-1', message: 'checked in', severity: 'NORMAL' };
      const savedEvent = { id: 'abc', ...input, createdAt: new Date() };
      prisma.event.create.mockResolvedValue(savedEvent);

      const result = await eventService.createEvent(input);

      expect(prisma.event.create).toHaveBeenCalledWith({ data: input });
      expect(io.emit).toHaveBeenCalledWith('event:new', savedEvent);
      expect(dispatchNotification).toHaveBeenCalledWith(savedEvent);
      expect(result).toBe(savedEvent);
    });

    it('calls emit and dispatch after the DB write completes, not before', async () => {
      const callOrder = [];
      prisma.event.create.mockImplementation(async () => {
        callOrder.push('db');
        return { id: '1' };
      });
      io.emit.mockImplementation(() => callOrder.push('emit'));
      dispatchNotification.mockImplementation(() => callOrder.push('notify'));

      await eventService.createEvent({ type: 'CHECK_IN', patientRef: 'P-1', message: 'x' });

      expect(callOrder).toEqual(['db', 'emit', 'notify']);
    });
  });

  describe('listEvents', () => {
    it('returns the most recent events up to the given limit', async () => {
      const events = [{ id: '1' }, { id: '2' }];
      prisma.event.findMany.mockResolvedValue(events);

      const result = await eventService.listEvents(10);

      expect(prisma.event.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
      expect(result).toBe(events);
    });

    it('defaults to a limit of 50', async () => {
      prisma.event.findMany.mockResolvedValue([]);

      await eventService.listEvents();

      expect(prisma.event.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    });
  });
});
