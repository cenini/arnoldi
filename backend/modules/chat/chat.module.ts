import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller.js';
import { LlmService } from './llm.service.js';
import { OpenAI } from "langchain/llms";

@Module({
    controllers: [ChatController],
    providers: [
        {
          provide: 'OpenAI',
          useFactory: () => {
            return new OpenAI({ temperature: 0.9 });
          },
        },
        LlmService,
      ],
    exports: [ChatModule]
})
export class ChatModule {}