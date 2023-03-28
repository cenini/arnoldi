import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

// import { AppModule } from './app.module';

async function bootstrap() {
  console.log(process.env.OPENAI_API_KEY)
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
