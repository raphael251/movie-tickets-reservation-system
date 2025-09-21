import 'dotenv/config';
import { createApp } from './app.ts';
import { AppConfigLoader } from './modules/shared/configs/app-config.ts';
import { appDataSource } from './modules/shared/data-source/data-source.ts';
import { Seeder } from './modules/shared/seed/seeder.ts';

export async function startApplication() {
  const app = createApp();

  const appConfig = AppConfigLoader.load();

  await appDataSource.initialize();

  console.log('Data Source has been initialized!');

  await Seeder.run();

  app.listen(appConfig.SERVER_PORT, () => {
    console.log(`Server is running on port ${appConfig.SERVER_PORT}`);
  });
}

startApplication().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
