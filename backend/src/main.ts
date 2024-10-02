import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/index.module';
import logger from './log/logger';

async function bootstrap() {
  const PORT = process.env.NODE_PORT || 8080;
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.NODE_PORT || 8080, () => {
    logger.info(`Server is running in port ${PORT}`);
  });
}
bootstrap();
