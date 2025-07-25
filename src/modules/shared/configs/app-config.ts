import zod from 'zod';

/**
 * AppConfigLoader is responsible for loading and validating the application configuration
 * from environment variables using Zod for schema validation.
 */
export class AppConfigLoader {
  static load() {
    const envSchema = zod.object({
      SERVER_PORT: zod.string(),

      DB_USERNAME: zod.string(),
      DB_PASSWORD: zod.string(),
      DB_DATABASE: zod.string(),
      DB_HOST: zod.string(),
      DB_PORT: zod.coerce.number(),
    });

    const envParsingResult = envSchema.safeParse(process.env);

    if (!envParsingResult.success) {
      console.error('Invalid environment variables:', JSON.stringify(zod.treeifyError(envParsingResult.error)));
      process.exit(1);
    }

    return envParsingResult.data;
  }
}
