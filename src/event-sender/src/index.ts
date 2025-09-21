import { Events, Outbox, OutboxEventStatus } from './modules/events/database/outbox.entity.ts';
import { appDataSource } from './modules/shared/data-source/data-source.ts';

async function startApplication() {
  console.log('Starting Event Sender application...');

  await appDataSource.initialize();

  console.log('App Data Source has been initialized!');

  const outboxRepo = appDataSource.getRepository(Outbox);
  const eventsToSend = await outboxRepo.find({ where: { status: OutboxEventStatus.PENDING }, take: 10 });

  if (eventsToSend.length === 0) {
    console.log('There is no pending events to send! Finishing the application...');
    return;
  }

  for (const event of eventsToSend) {
    console.log(`the event with payload ${event.payload} was sent!`);

    if (event.event === Events.USER_CREATED) {
      // send email
    }

    // event.status = OutboxEventStatus.SENT;

    // await outboxRepo.update({ id: event.id }, event);
  }

  console.log('Event Sender has finished sending the events!');
}

startApplication().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
