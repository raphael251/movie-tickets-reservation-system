import { Events, Outbox, OutboxEventStatus } from './modules/events/database/outbox.entity.ts';
import { appDataSource } from './modules/shared/data-source/data-source.ts';
import { AppConfigLoader } from './modules/shared/configs/app-config.ts';
import nodemailer from 'nodemailer';

async function startApplication() {
  const appConfig = AppConfigLoader.load();

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
      const transporter = nodemailer.createTransport({
        host: appConfig.EMAIL_HOST,
        port: appConfig.EMAIL_PORT,
        secure: false,
        ignoreTLS: true,
        auth: {
          user: appConfig.EMAIL_USERNAME,
          pass: appConfig.EMAIL_PASSWORD,
        },
      });

      await transporter.verify();

      console.log('Server is ready to take our messages');

      try {
        const info = await transporter.sendMail({
          from: '"Movie Tickets Reservation System" <events@movietickets.com>',
          to: JSON.parse(event.payload).email,
          subject: 'A new user was created',
          text: 'Just to tell you a new user was created!',
          html: '<h1>Email notification - Movie Tickets Reservation System</h1><b>Just to tell you a new user was created!</b>',
        });

        console.log('Message sent: %s', info.messageId);
      } catch (err) {
        console.error('Error while sending mail', err);
      }
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
