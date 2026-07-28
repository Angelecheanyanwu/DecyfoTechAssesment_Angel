const SAMPLES = [
  { type: 'CHECK_IN', message: 'Patient checked in at front desk', severity: 'NORMAL' },
  { type: 'TRIAGE_STARTED', message: 'Triage started', severity: 'NORMAL' },
  { type: 'TRIAGE_COMPLETE', message: 'Triage complete, patient sent to ward', severity: 'NORMAL' },
  { type: 'ALERT', message: 'Vitals out of range, needs attention', severity: 'HIGH' },
  { type: 'ALERT', message: 'Cardiac arrest — code blue', severity: 'CRITICAL' },
];

function randomEventData() {
  const sample = SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
  const patientRef = `P-${Math.floor(1000 + Math.random() * 9000)}`;
  return { ...sample, patientRef };
}

function startEventSimulator({ eventService, intervalMs = 15000 }) {
  const timer = setInterval(() => {
    eventService.createEvent(randomEventData()).catch((err) => {
      console.error('[simulator] failed to create event', err);
    });
  }, intervalMs);

  return () => clearInterval(timer);
}

module.exports = { startEventSimulator, randomEventData };
