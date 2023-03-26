import { Module, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ChatModule } from './modules/chat/chat.module.js'


@Module({
  imports: [ChatModule],
})
class AppModule {}

async function main () {
  // process.env.NEST_DEBUG = "truthy"
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(8080);
  Logger.log('Server started on http://localhost:8080', 'NestApplication');
}

main();