import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller.js';
import { LlmService } from './llm.service.js';
import { Collection } from 'mongodb';
import { Session } from './Session.js';
import { MessageDto, SenderDto, SessionDto } from './session.dto.js';

function createSessionDto(): SessionDto {
  return new SessionDto({
    id: 'id',
    userId: 'userId',
    messages: [
      new MessageDto({
        text: 'text',
        sender: SenderDto.User,
      }),
    ],
  });
}

describe('ChatController', () => {
  let chatController: ChatController;
  let llmService: LlmService;
  let sessionCollection: Collection<Session>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: LlmService,
          useValue: {
            chain: jest.fn().mockReturnValue('response'),
            vectorize: jest.fn(),
          },
        },
        { provide: Collection<Session>, useValue: { updateMany: jest.fn() } },
      ],
    }).compile();

    chatController = module.get<ChatController>(ChatController);
    llmService = module.get<LlmService>(LlmService);
    sessionCollection = module.get<Collection<Session>>(Collection);
  });

  it('should call updateMany and llmService.chain on POST request', async () => {
    const sessionDto = createSessionDto();

    await chatController.prompt(sessionDto);

    expect(sessionCollection.updateMany).toHaveBeenCalled();
    expect(llmService.chain).toHaveBeenCalled();
  });

  it('should call updateMany and llmService.vectorize on POST endsession request', async () => {
    const sessionDto = createSessionDto();

    await chatController.endSession(sessionDto);

    expect(sessionCollection.updateMany).toHaveBeenCalled();
    expect(llmService.vectorize).toHaveBeenCalled();
  });

  it('should not throw when updating the session collection fails', async () => {
    const sessionDto = createSessionDto();
    jest.spyOn(sessionCollection, 'updateMany').mockImplementation(() => {
      throw new Error('Failed to update');
    });

    await chatController.prompt(sessionDto);
    await chatController.endSession(sessionDto);
  });
});
