import { Module } from '@nestjs/common';
import { OpenAI } from 'langchain';
import { ChatOpenAI } from "langchain/chat_models";
import { ChatController } from './chat.controller.js';
import { LlmService } from './llm.service.js';

@Module({
    controllers: [ChatController],
    providers: [
        {
          provide: 'OpenAI',
          useFactory: () => {
            return new OpenAI({ temperature: 1 });
          },
        },
        {
          provide: 'ChatOpenAI',
          useFactory: () => {
            return new ChatOpenAI({ temperature: 1 })
          }
        },
        LlmService,
      ],
    exports: [ChatModule]
})
export class ChatModule {}