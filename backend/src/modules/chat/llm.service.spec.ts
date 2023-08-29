import { Test, TestingModule } from '@nestjs/testing';
import { LlmService } from './llm.service.js';
import { OpenAI } from 'langchain';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Collection } from 'mongodb';
import { Message, Sender, Session } from './Session.js';

function createSession(): Session {
  return {
    Messages: [
      { sender: Sender.User, text: 'Hello' } as Message,
      { sender: Sender.Ai, text: 'Hello' } as Message,
    ] as Message[],
    Id: 'id',
    UserId: 'userId',
  } as Session;
}

jest.mock('langchain/chains', () => {
  return {
    ConversationChain: jest.fn().mockImplementation(() => {
      return { call: jest.fn().mockReturnValue({ response: 'result' }) };
    }),
  };
});

describe('LlmService', () => {
  let llmService: LlmService;
  let model: OpenAI;
  let chat: ChatOpenAI;
  let sessionCollection: Collection<Session>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LlmService,
        { provide: OpenAI, useValue: { call: jest.fn() } },
        { provide: ChatOpenAI, useValue: {} },
        { provide: Collection<Session>, useValue: {} },
      ],
    }).compile();

    llmService = module.get<LlmService>(LlmService);
    model = module.get<OpenAI>(OpenAI);
    chat = module.get<ChatOpenAI>(ChatOpenAI);
    sessionCollection = module.get<Collection<Session>>(Collection);
  });

  it('should throw an error if not initialized', async () => {
    expect(llmService.getInitialMessage()).rejects.toThrow(
      'Internal Server Error',
    );
    expect(llmService.chain({} as Session)).rejects.toThrow(
      'Internal Server Error',
    );
  });

  it('should call model.call method', async () => {
    const prompt = 'test prompt';

    await llmService.call(prompt);

    expect(model.call).toHaveBeenCalledWith(prompt);
  });

  it('should be initialized after initialization', async () => {
    llmService.onModuleInit();

    expect(llmService.isInitialized).toBe(true);
  });

  it('should return chain conversation', async () => {
    await llmService.onModuleInit();
    const session: Session = createSession();

    const result = await llmService.chain(session);

    expect(result).toContain('result');
  });
});
