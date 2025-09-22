import z from 'zod';

// Define the schema at the module level for type inference and reuse
const envSchema = z.object({
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_SSL_CA_PATH: z.string().optional(),
  DB_MIGRATIONS_PATH: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_LOGGING_ENABLED: z.coerce.boolean().default(false),

  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.coerce.number(),
  EMAIL_USERNAME: z.string(),
  EMAIL_PASSWORD: z.string(),
});

// Export the inferred type for use in other modules
export type AppConfig = z.infer<typeof envSchema>;

export const AppConfig = Symbol.for('AppConfig');

/**
 * AppConfigLoader is responsible for loading and validating the application configuration
 * from environment variables using Zod for schema validation.
 */
export class AppConfigLoader {
  static load(): AppConfig {
    const envParsingResult = envSchema.safeParse(process.env);

    if (!envParsingResult.success) {
      console.error('Invalid environment variables:', JSON.stringify(z.treeifyError(envParsingResult.error)));
      process.exit(1);
    }

    return envParsingResult.data;
  }
}
