require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const { createApp } = require('./app');
const { createEventService } = require('./services/eventService');
const { startEventSimulator } = require('./simulator/eventSimulator');

const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || '*';

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: FRONTEND_URL },
});

const eventService = createEventService({ io });
const app = createApp({ eventService });
server.on('request', app);

io.on('connection', (socket) => {
  console.log(`[socket] client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[socket] client disconnected: ${socket.id}`);
  });
});

if (process.env.ENABLE_SIMULATOR === 'true') {
  startEventSimulator({ eventService, intervalMs: Number(process.env.SIMULATOR_INTERVAL_MS) || 15000 });
  console.log('[simulator] auto event simulator enabled');
}

server.listen(PORT, () => {
  console.log(`[server] listening on port ${PORT}`);
});

module.exports = { server, io, app };
