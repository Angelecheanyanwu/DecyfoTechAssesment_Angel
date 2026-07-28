const CHANNELS = {
  IN_APP: 'in_app',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
};

function resolveChannel(event) {
  return event.severity === 'HIGH' ? CHANNELS.SMS : CHANNELS.IN_APP;
}

function dispatchNotification(event) {
  const channel = resolveChannel(event);

  if (channel === CHANNELS.IN_APP) {
    console.log(
      `[notification][in_app] Pushed: "${event.message}" (type=${event.type}, severity=${event.severity}, eventId=${event.id})`
    );
  }

  if (channel === CHANNELS.SMS) {
    console.log(
      `[notification][sms][STUB] Would send SMS for: "${event.message}" (type=${event.type}, severity=${event.severity}, eventId=${event.id})`
    );
  }

  if (channel === CHANNELS.WHATSAPP) {
    console.log(
      `[notification][whatsapp][STUB] Would send WhatsApp message for: "${event.message}" (type=${event.type}, severity=${event.severity}, eventId=${event.id})`
    );
  }

  return { channel };
}

module.exports = { dispatchNotification, resolveChannel, CHANNELS };
