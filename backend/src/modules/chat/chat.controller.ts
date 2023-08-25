import { Inject, Controller, Body, Get, Post, HttpException, InternalServerErrorException, HttpStatus, Logger} from '@nestjs/common';
import { LlmService } from './llm.service.js';
import { PromptDto } from './prompt.dto.js';
import { MessageDto, SessionDto } from './session.dto.js';
import { Collection, ObjectId } from 'mongodb';
import { Session } from './Session.js';

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

@Controller('chat')
export class ChatController {
  constructor(
    @Inject(LlmService) private readonly llmService: LlmService,
    @Inject("SessionCollection") private readonly sessionCollection: Collection<Session>,
    ) {}

  private readonly logger = new Logger(ChatController.name);

  @Get()
  async index () {
    this.logger.log("Hello!")
    return {
      message: 'Hello Coach!',
      date: new Date(),
    };
  }

  @Post()
  async prompt(@Body() sessionDto: SessionDto) {
    let session: Session
    try {
      session = SessionDto.toObject(sessionDto);      
    } catch (e) {
      throw new HttpException('Could not create session from request', HttpStatus.BAD_REQUEST)
    }
    const filter = { Id: session.Id };
    try {
      await this.sessionCollection.updateMany(filter, { $set:session }, { upsert: true });
      let response = await this.llmService.chain(session);      
      return { message: response.replace(new RegExp("^(Arnold(?:\\sSchwarzenegger)?\\:)", "i"), "") };
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }

  @Post("endsession")
  async endSession(@Body() sessionDto: SessionDto) {
    const session = SessionDto.toObject(sessionDto);
    const filter = { Id: session.Id };
    await this.sessionCollection.updateMany(filter, { $set:session }, { upsert: true });
    await this.llmService.storeSession(session);
  }
}