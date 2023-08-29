import { Test, TestingModule } from '@nestjs/testing';
import { LlmService } from './llm.service.js';
import { OpenAI } from 'langchain';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Collection } from 'mongodb';
import { Message, Sender, Session } from './Session.js';
import { ConversationChainFactory } from './ConversationChainFactory.js';

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

describe('LlmService', () => {
  let llmService: LlmService;
  let model: OpenAI;
  let chat: ChatOpenAI;
  let sessionCollection: Collection<Session>;
  let conversationChainFactory: ConversationChainFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LlmService,
        { provide: OpenAI, useValue: { call: jest.fn() } },
        { provide: ChatOpenAI, useValue: {} },
        { provide: Collection<Session>, useValue: {} },
        ConversationChainFactory,
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

  it('should return chain conversation', async () => {
    llmService.isInitialized = true;
    const session: Session = createSession();
    const result = await llmService.chain(session);
    expect(result).toContain('User: Hello');
    expect(result).toContain('Arnold Schwarzenegger: Hello');
  });
});
