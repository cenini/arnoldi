import { Inject, Controller, Body, Get, Post} from '@nestjs/common';
import { LlmService } from './llm.service.js';
import { PromptDto } from './prompt.dto.js';

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
      // // console.log(`Got a request with text: ${prompt.text}`)
      // return { message: "TEST RESPONSE HERE" }
      const message = await this.llmService.chain(prompt.text);
      // console.log(message)
      return { message: message.response };
    }
}