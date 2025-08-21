import { appDataSource } from '../modules/shared/data-source/data-source';

export default async () => {
  if (!appDataSource.isInitialized) {
    await appDataSource.initialize();
  }
};
