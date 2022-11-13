/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core';
import { LoggingInterceptor } from '@schematics/interceptors/logging.interceptor';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
const helmet = require('helmet');
const csurf = require('csurf');
dotenv.config();

async function bootstrap() {
  const port = process.env.PORT ?? 8080;
  const app = await NestFactory.create(AppModule, {
    cors: true,
    // cors: {
    //  allowedHeaders: '*',
    // },
  });
  await app.listen(port);

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use(helmet());
  app.use(csurf());
  app.enableCors();
}
bootstrap();
