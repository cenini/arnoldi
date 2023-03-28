import { Module } from '@nestjs/common';
import { OpenAI } from 'langchain';
// import { OpenAI } from "langchain/llms";
import { ChatOpenAI } from "langchain/chat_models";
import { ChatController } from './chat.controller.js';
import { LlmService } from './llm.service.js';

@Module({
    controllers: [ChatController],
    providers: [
        {
          provide: 'OpenAI',
          useFactory: () => {
            return new OpenAI({ temperature: 0.9 });
          },
        },
        {
          provide: 'ChatOpenAI',
          useFactory: () => {
            return new ChatOpenAI({ temperature: 0.9 })
          }
        },
        LlmService,
      ],
    exports: [ChatModule]
})
export class ChatModule {}