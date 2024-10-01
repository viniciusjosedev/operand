import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/index.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.NODE_PORT || 8080);
}
bootstrap();
