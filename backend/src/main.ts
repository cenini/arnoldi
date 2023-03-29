import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface.js';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

// import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.enableCors(corsOptions);
  
  await app.listen(3000);
}
bootstrap();
