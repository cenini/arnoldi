import { Inject, Controller, Body, Get, Post} from '@nestjs/common';
import { PromptDto } from './prompt.dto.js';
import { LlmService } from './llm.service.js';

@Controller('chat')
export class ChatController {
  constructor(@Inject(LlmService) private readonly llmService: LlmService) {}

  @Get()
  public index () {
    return {
      message: 'Hello Coach!',
      date: new Date(),
    };
  }

    @Post()
    async prompt(@Body() prompt: PromptDto) {
        // return await this.llmService.call(prompt.text);
        return await this.llmService.chain(prompt.text);
    }
}