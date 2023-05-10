import { Inject, Controller, Body, Get, Post} from '@nestjs/common';
import { LlmService } from './llm.service.js';
import { PromptDto } from './prompt.dto.js';
import { MessageDto, SessionDto } from './session.dto.js';

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

@Controller('chat')
export class ChatController {
  constructor(
    @Inject(LlmService) private readonly llmService: LlmService,
    ) {}

  @Get()
  async index () {
    return {
      message: 'Hello Coach!',
      date: new Date(),
    };
  }

  @Post()
  // async prompt(@Body() message: MessageDto) {
  async prompt(@Body() session: SessionDto) {    
    // Cache the input (I guess). After a conversation is idle for a longer period of time, 
    // create embeddings and store them. 

    // // console.log(`Got a request with text: ${prompt.text}`)
    // await delay(1000);

    // get the session
    // then pass the session to the llmService
    console.log("hello world")
    let response = await this.llmService.chain(SessionDto.toObject(session));
    return { message: response.replace(new RegExp("^(Arnold(?:\\sSchwarzenegger)?\\:)", "i"), "") };
  }
  // async prompt(@Body() session: SessionDto) {
  //   // Cache the input (I guess). After a conversation is idle for a longer period of time, 
  //   // create embeddings and store them. 

  //   // // console.log(`Got a request with text: ${prompt.text}`)
  //   // await delay(1000);
  //   let response = await this.llmService.chain(SessionDto.toObject(session));
  //   return { message: response.replace(new RegExp("^(Arnold(?:\\sSchwarzenegger)?\\:)", "i"), "") };
  // }

  // @Post("/InitialMessage")
  // async initialMessage (@Body() : InitialMessageDto) {
  //   return await this.llmService.getInitialMessage();
  //   return {
  //     message: 'Hello Coach!',
  //     date: new Date(),
  //   };
  // }

  @Post("endsession")
  async endSession(@Body() session: SessionDto) {
    return await this.llmService.storeSession(SessionDto.toObject(session));
  }
}