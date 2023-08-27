import { Collection } from 'mongodb';
import { Test } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { LlmService } from './llm.service';
import { Session } from './Session';
import { MessageDto, SenderDto, SessionDto } from './session.dto';

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
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LlmService,
          useValue: {
            chain: jest.fn().mockResolvedValue('Response!'),
          },
        },
        {
          provide: Collection<Session>,
          useValue: {
            updateMany: jest
              .fn()
              .mockImplementation((session: Session) =>
                Promise.resolve({ _id: 'a uuid', ...session }),
              ),
          },
        },
      ],
      controllers: [ChatController],
    }).compile();

    llmService = moduleRef.get<LlmService>(LlmService);
    sessionCollection = moduleRef.get<Collection<Session>>(Collection<Session>);
    chatController = moduleRef.get<ChatController>(ChatController);
  });

  describe('prompt', () => {
    it('should store the session in the session collection', async () => {
      jest.spyOn(sessionCollection, 'updateMany');

      expect(chatController.prompt(createSessionDto()));
      expect(sessionCollection.updateMany).toHaveBeenCalled();
    });
  });
});
