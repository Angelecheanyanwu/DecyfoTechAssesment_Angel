const prisma = require('../prisma');
const { dispatchNotification } = require('./notificationService');

function createEventService({ io }) {
  async function createEvent(data) {
    const event = await prisma.event.create({ data });
    io.emit('event:new', event);
    dispatchNotification(event);
    return event;
  }

  async function listEvents(limit = 50) {
    return prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  return { createEvent, listEvents };
}

module.exports = { createEventService };
