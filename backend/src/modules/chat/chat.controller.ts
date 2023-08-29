import {
  Inject,
  Controller,
  Body,
  Get,
  Post,
  HttpException,
  InternalServerErrorException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { LlmService } from './llm.service.js';
import { PromptDto } from './prompt.dto.js';
import { MessageDto, SessionDto } from './session.dto.js';
import { Collection, ObjectId } from 'mongodb';
import { Session } from './Session.js';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Controller('chat')
export class ChatController {
  constructor(
    @Inject(LlmService)
    private readonly llmService: LlmService,
    @Inject(Collection<Session>)
    private readonly sessionCollection: Collection<Session>,
  ) {}

  private readonly logger = new Logger(ChatController.name);

  async updateCollection(session: Session) {
    try {
      const filter = { Id: session.Id };
      await this.sessionCollection.updateMany(
        filter,
        { $set: session },
        { upsert: true },
      );
    } catch (e) {
      this.logger.error('Failed to upsert session to collection');
    }
  }

  @Get()
  async index() {
    this.logger.log('Hello!');
    return {
      message: 'Hello Coach!',
      date: new Date(),
    };
  }

  @Post()
  async prompt(@Body() sessionDto: SessionDto) {
    let session = SessionDto.toObject(sessionDto);
    await this.updateCollection(session);
    let response = await this.llmService.chain(session);
    return {
      message: response.replace(
        new RegExp('^(Arnold(?:\\sSchwarzenegger)?\\:)', 'i'),
        '',
      ),
    };
  }

  @Post('endsession')
  async endSession(@Body() sessionDto: SessionDto) {
    let session = SessionDto.toObject(sessionDto);
    await this.updateCollection(session);
    await this.llmService.vectorize(session);
  }
}
