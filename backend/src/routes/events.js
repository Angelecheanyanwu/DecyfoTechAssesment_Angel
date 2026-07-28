const express = require('express');
const { randomEventData } = require('../simulator/eventSimulator');

const EVENT_TYPES = ['CHECK_IN', 'TRIAGE_STARTED', 'TRIAGE_COMPLETE', 'ALERT'];
const SEVERITIES = ['NORMAL', 'HIGH'];

function createEventsRouter({ eventService }) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const events = await eventService.listEvents(limit);
      res.json(events);
    } catch (err) {
      next(err);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const { type, patientRef, message, severity } = req.body;

      if (!type || !EVENT_TYPES.includes(type)) {
        return res.status(400).json({ error: `type must be one of ${EVENT_TYPES.join(', ')}` });
      }
      if (!patientRef) {
        return res.status(400).json({ error: 'patientRef is required' });
      }
      if (!message) {
        return res.status(400).json({ error: 'message is required' });
      }
      if (severity && !SEVERITIES.includes(severity)) {
        return res.status(400).json({ error: `severity must be one of ${SEVERITIES.join(', ')}` });
      }

      const event = await eventService.createEvent({
        type,
        patientRef,
        message,
        severity: severity || 'NORMAL',
      });

      res.status(201).json(event);
    } catch (err) {
      next(err);
    }
  });

  router.post('/simulate', async (req, res, next) => {
    try {
      const event = await eventService.createEvent(randomEventData());
      res.status(201).json(event);
    } catch (err) {
      next(err);
    }
  });

  return router;
}

module.exports = { createEventsRouter, EVENT_TYPES, SEVERITIES };
