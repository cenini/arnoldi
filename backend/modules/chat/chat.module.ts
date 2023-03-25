import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller.js';
import { LlmService } from './llm.service.js';

@Module({
    controllers: [ChatController],
    providers: [LlmService],
    exports: [ChatModule]
})
export class ChatModule {}