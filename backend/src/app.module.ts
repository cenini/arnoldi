import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ChatModule } from './modules/chat/chat.module.js';

@Module({
  imports: [ ConfigModule.forRoot(), ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
