import z from 'zod';
import swaggerjsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export const swaggerConfigSchema = z.object({
  serverUrl: z.url(),
  apisPaths: z.array(z.string()),
});

export type SwaggerConfig = z.infer<typeof swaggerConfigSchema>;

export function configSwagger({ serverUrl, apisPaths }: SwaggerConfig): [typeof swaggerUi.serve, ReturnType<typeof swaggerUi.setup>] {
  const swaggerOptions: swaggerjsdoc.Options = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Movie Ticket Reservation System',
        description: 'This is an API to make ticket reservations to watch incredible movies on the theaters',
        contact: {
          name: 'Raphael Passos',
          email: 'raphael251@hotmail.com',
          url: 'https://www.linkedin.com/in/rapha-passos/',
        },
        version: '1.0.0',
      },
      servers: [
        {
          url: serverUrl,
        },
      ],
    },
    apis: apisPaths,
  };

  const swaggerDocs = swaggerjsdoc(swaggerOptions);

  return [swaggerUi.serve, swaggerUi.setup(swaggerDocs)];
}
