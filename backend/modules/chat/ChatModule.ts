import { Controller, Injectable, Inject, Req, Body, Get, Post, Module, Logger, RawBodyRequest, ValidationPipe} from '@nestjs/common';
import { PromptDto } from './PromptDto.js';
import { LlmService } from './LlmService.js';

@Controller('chat')
class ChatController {
  constructor(private llmService: LlmService) {}

  @Get()
  public index () {
    return {
      message: 'Hello Coach!',
      date: new Date(),
    };
  }

    @Post()
    async prompt(@Body() prompt: PromptDto) {
        console.log(this.llmService)
        let llmService = new LlmService();
        let response = await llmService.call(prompt.text);
        // let response = Promise.resolve("Bla\n");
        console.log(response)
        return response
    }
}

@Module({
    controllers: [ChatController],
    providers: [LlmService]
})
export class ChatModule {}