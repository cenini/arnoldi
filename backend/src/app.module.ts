import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ChatModule } from './modules/chat/chat.module.js';
import { PineconeClient } from "@pinecone-database/pinecone";
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [ ConfigModule.forRoot(), LoggerModule.forRoot(), ChatModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'Pinecone',
      useFactory: async () => {
        const pinecone = new PineconeClient();
        // Could also init in the places where it is injected but...
        await pinecone.init({
          environment: process.env.ENVIRONMENT,
          apiKey: process.env.PINECONE_API_KEY,
        })
        return pinecone;
      },
    },
  ],
})
export class AppModule {}
