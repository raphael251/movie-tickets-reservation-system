import zod from 'zod';

// Define the schema at the module level for type inference and reuse
const envSchema = zod.object({
  SERVER_PORT: zod.string(),

  JWT_SECRET: zod.string(),
  JWT_EXPIRATION: zod.coerce.number(),

  DB_USERNAME: zod.string(),
  DB_PASSWORD: zod.string(),
  DB_DATABASE: zod.string(),
  DB_SSL_CA_PATH: zod.string().optional(),
  DB_MIGRATIONS_PATH: zod.string(),
  DB_HOST: zod.string(),
  DB_PORT: zod.coerce.number(),
  DB_LOGGING_ENABLED: zod.coerce.boolean().default(false),

  PAGINATION_DEFAULT_LIMIT: zod.coerce.number().default(10),
});

// Export the inferred type for use in other modules
export type AppConfig = zod.infer<typeof envSchema>;

export const AppConfig = Symbol.for('AppConfig');

/**
 * AppConfigLoader is responsible for loading and validating the application configuration
 * from environment variables using Zod for schema validation.
 */
export class AppConfigLoader {
  static load(): AppConfig {
    const envParsingResult = envSchema.safeParse(process.env);

    if (!envParsingResult.success) {
      console.error('Invalid environment variables:', JSON.stringify(zod.treeifyError(envParsingResult.error)));
      process.exit(1);
    }

    return envParsingResult.data;
  }
}
