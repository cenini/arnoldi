import { Inject, Controller, Body, Get, Post} from '@nestjs/common';
import { LlmService } from './llm.service.js';
import { PromptDto } from './prompt.dto.js';

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

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
      // Cache the input (I guess). After a conversation is idle for a longer period of time, 
      // create embeddings and store them. 

      // // console.log(`Got a request with text: ${prompt.text}`)
      // await delay(1000);
      // return { message: "TEST RESPONSE HERE" }
      const message = await this.llmService.chain(prompt.text);
      // console.log(message)
      return { message: message.response };
    }
}