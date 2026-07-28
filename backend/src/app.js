const express = require('express');
const cors = require('cors');
const { createEventsRouter } = require('./routes/events');

function createApp({ eventService }) {
  const app = express();

  app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/events', createEventsRouter({ eventService }));

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
