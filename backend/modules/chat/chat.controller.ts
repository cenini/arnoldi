import { Controller, Body, Get, Post} from '@nestjs/common';
import { PromptDto } from './prompt.dto.js';
import { LlmService } from './llm.service.js';

@Controller('chat')
export class ChatController {
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
        // let llmService = new LlmService();
        // let response = await llmService.call(prompt.text);
        let response = await this.llmService.call(prompt.text);
        // let response = Promise.resolve("Bla\n");
        console.log(response)
        return response
    }
}