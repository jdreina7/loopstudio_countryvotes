import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { VersioningType, Logger } from '@nestjs/common';
import { MESSAGES } from './common/constants/messages';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Validate required environment variables
  if (!process.env.REST_COUNTRIES_API) {
    logger.error(
      `${MESSAGES.APP.ERROR_PREFIX} ${MESSAGES.ENV.REST_API_REQUIRED}`,
    );
    logger.error(MESSAGES.ENV.REST_API_SET_ENV);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // Enable CORS
  app.enableCors();

  // Global validation pipe with Zod
  app.useGlobalPipes(new ZodValidationPipe());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('CountryVote API')
    .setDescription('API for voting and ranking favorite countries')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha', // Sort tags alphabetically
      operationsSorter: 'alpha', // Sort operations alphabetically within each tag
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(MESSAGES.APP.RUNNING(port));
  logger.log(MESSAGES.APP.SWAGGER_DOCS(port));
  logger.log(MESSAGES.APP.HEALTH_CHECK(port));
  logger.log(MESSAGES.APP.REST_API_CONFIG(process.env.REST_COUNTRIES_API));
}
void bootstrap();
