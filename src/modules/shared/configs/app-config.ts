import z from 'zod';
import { swaggerConfigSchema } from '../swagger/config';

// Define the schema at the module level for type inference and reuse
const envSchema = z.object({
  SERVER_PORT: z.string(),

  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.coerce.number(),

  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_SSL_CA_PATH: z.string().optional(),
  DB_MIGRATIONS_PATH: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_LOGGING_ENABLED: z.coerce.boolean().default(false),

  PAGINATION_DEFAULT_LIMIT: z.coerce.number().default(10),

  SWAGGER_DOCS_CONFIG: z
    .string()
    .transform((config, ctx) => {
      try {
        return JSON.parse(config);
      } catch (_) {
        ctx.addIssue({
          code: 'custom',
          message: 'Invalid Swagger Docs config JSON',
        });
        return z.NEVER;
      }
    })
    .pipe(swaggerConfigSchema)
    .optional(),
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
