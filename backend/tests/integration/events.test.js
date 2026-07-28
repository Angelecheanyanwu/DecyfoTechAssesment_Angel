const request = require('supertest');
const { createApp } = require('../../src/app');
const { createEventService } = require('../../src/services/eventService');
const prisma = require('../../src/prisma');

describe('events API (integration)', () => {
  let app;
  let io;

  beforeAll(() => {
    io = { emit: jest.fn() };
    const eventService = createEventService({ io });
    app = createApp({ eventService });
  });

  afterAll(async () => {
    await prisma.event.deleteMany({ where: { patientRef: { startsWith: 'TEST-' } } });
    await prisma.$disconnect();
  });

  describe('POST /api/events', () => {
    it('creates an event, persists it, and pushes it over the socket', async () => {
      const payload = {
        type: 'CHECK_IN',
        patientRef: 'TEST-1',
        message: 'Integration test check-in',
        severity: 'NORMAL',
      };

      const res = await request(app).post('/api/events').send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject(payload);
      expect(res.body.id).toBeDefined();

      const stored = await prisma.event.findUnique({ where: { id: res.body.id } });
      expect(stored).not.toBeNull();
      expect(stored.patientRef).toBe('TEST-1');

      expect(io.emit).toHaveBeenCalledWith('event:new', expect.objectContaining({ patientRef: 'TEST-1' }));
    });

    it('defaults severity to NORMAL when omitted', async () => {
      const res = await request(app).post('/api/events').send({
        type: 'TRIAGE_STARTED',
        patientRef: 'TEST-2',
        message: 'Integration test triage',
      });

      expect(res.status).toBe(201);
      expect(res.body.severity).toBe('NORMAL');
    });

    it('rejects a missing/invalid type with 400', async () => {
      const res = await request(app).post('/api/events').send({
        patientRef: 'TEST-3',
        message: 'missing type',
      });

      expect(res.status).toBe(400);
    });

    it('rejects a missing message with 400', async () => {
      const res = await request(app).post('/api/events').send({
        type: 'CHECK_IN',
        patientRef: 'TEST-4',
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/events/simulate', () => {
    it('creates a random valid event', async () => {
      const res = await request(app).post('/api/events/simulate').send();

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(['CHECK_IN', 'TRIAGE_STARTED', 'TRIAGE_COMPLETE', 'ALERT']).toContain(res.body.type);

      await prisma.event.delete({ where: { id: res.body.id } });
    });
  });

  describe('GET /api/events', () => {
    it('returns previously created events, most recent first', async () => {
      await request(app).post('/api/events').send({
        type: 'CHECK_IN',
        patientRef: 'TEST-5',
        message: 'first',
      });
      await request(app).post('/api/events').send({
        type: 'CHECK_IN',
        patientRef: 'TEST-6',
        message: 'second',
      });

      const res = await request(app).get('/api/events');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const refs = res.body.map((e) => e.patientRef);
      expect(refs.indexOf('TEST-6')).toBeLessThan(refs.indexOf('TEST-5'));
    });
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });
});
