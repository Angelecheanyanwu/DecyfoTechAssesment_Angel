const http = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');
const { createApp } = require('../../src/app');
const { createEventService } = require('../../src/services/eventService');
const prisma = require('../../src/prisma');

describe('socket event push (integration)', () => {
  let server;
  let io;
  let eventService;
  let clientSocket;

  beforeAll((done) => {
    server = http.createServer();
    io = new Server(server, { cors: { origin: '*' } });
    eventService = createEventService({ io });
    const app = createApp({ eventService });
    server.on('request', app);

    server.listen(() => {
      const { port } = server.address();
      clientSocket = Client(`http://localhost:${port}`, { transports: ['websocket'] });
      clientSocket.on('connect', done);
    });
  });

  afterAll(async () => {
    clientSocket.close();
    io.close();
    await new Promise((resolve) => server.close(resolve));
    await prisma.event.deleteMany({ where: { patientRef: { startsWith: 'TEST-SOCKET' } } });
    await prisma.$disconnect();
  });

  it('pushes a newly created event to connected clients via event:new', (done) => {
    clientSocket.once('event:new', (event) => {
      expect(event.patientRef).toBe('TEST-SOCKET-1');
      expect(event.type).toBe('ALERT');
      done();
    });

    eventService.createEvent({
      type: 'ALERT',
      patientRef: 'TEST-SOCKET-1',
      message: 'Vitals critical',
      severity: 'HIGH',
    });
  });
});
