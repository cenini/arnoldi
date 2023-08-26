import { ChatController } from "src/modules/chat/chat.controller";
import { LlmService } from "src/modules/chat/llm.service";
import { Collection } from "mongodb";
import { Session } from "src/modules/chat/Session";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";

describe('ChatController', () => {
  let chatController: ChatController;
  let llmService: LlmService;
  let sessionCollection: Collection<Session>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [LlmService, Collection<Session>],
      }).compile();

    llmService = await moduleRef.resolve<LlmService>(LlmService);
    sessionCollection = await moduleRef.resolve<Collection<Session>>(Collection<Session>);
    chatController = await moduleRef.resolve<ChatController>(ChatController);
  })

  describe('prompt', () => {
    it('should store the session in the session collection', async () => {
      // jest.spyOn(sessionCollection, 'updateMany').mockImplementation(() => result);
      jest.spyOn(sessionCollection, 'updateMany');

      expect(sessionCollection.updateMany).toHaveBeenCalledWith({ upsert: true})
    })
  })
})
