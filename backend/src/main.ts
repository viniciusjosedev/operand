import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/index.module';
import logger from './log/logger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const urlsPermitted = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : '*';

  const PORT = process.env.NODE_PORT || 8080;
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: urlsPermitted,
      credentials: true,
    },
  });

  app.use(cookieParser());

  await app.listen(process.env.NODE_PORT || 8080, () => {
    logger.info(`Server is running in port ${PORT}`);
  });
}
bootstrap();
