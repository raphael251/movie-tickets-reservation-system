import { appDataSource } from '../modules/shared/data-source/data-source.ts';
import { Seeder } from '../modules/shared/seed/seeder';
import { User } from '../modules/users/database/user.entity';
import { UserRole } from '../modules/users/util/constants/roles';

export default async () => {
  if (!appDataSource.isInitialized) {
    await appDataSource.initialize();
    await appDataSource.runMigrations();

    await Seeder.run();

    await appDataSource.getRepository(User).insert({
      email: 'regular@mail.com',
      password:
        '796f3a3af4f5acd5bde38733b66dfe51:18c469efb25d8cfafdb1d063fbd5bf6d2fece945dfe17ca49f9eadf6681da81077e5513c16598fc7f1c5581c1912f4f78f5b667da09c648d91a7bf35f0803e68',
      role: UserRole.REGULAR,
    });
    await appDataSource.getRepository(User).insert({
      email: 'admin@mail.com',
      password:
        '796f3a3af4f5acd5bde38733b66dfe51:18c469efb25d8cfafdb1d063fbd5bf6d2fece945dfe17ca49f9eadf6681da81077e5513c16598fc7f1c5581c1912f4f78f5b667da09c648d91a7bf35f0803e68',
      role: UserRole.ADMIN,
    });
  }
};
