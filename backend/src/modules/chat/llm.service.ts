import { Injectable, Inject, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationChain, LLMChain, ConversationalRetrievalQAChain, VectorDBQAChain } from 'langchain/chains';
import { ChatPromptTemplate, SystemMessagePromptTemplate, MessagesPlaceholder, HumanMessagePromptTemplate } from 'langchain/prompts';
import { Agent, AgentExecutor, ChatAgent, initializeAgentExecutor, ZeroShotAgent } from 'langchain/agents';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { VectorStore } from 'langchain/vectorstores/base';
import { ChainTool, SerpAPI } from "langchain/tools";
import { Document } from "langchain/document";
import { Session, Sender } from '../models/Session.js';
import { Collection } from 'mongodb';

async function createDocumentsFromSession(session: Session): Promise<Document<Record<string, any>>[]> {
  const documents: Document<Record<string, any>>[] = [];
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  for (const message of session.Messages) {
    const docs = await textSplitter.createDocuments([message.text]);
    for (const doc of docs) {
      documents.push(new Document({ 
        pageContent: doc.pageContent, 
        metadata: 
        { 
          sender: message.sender, 
          sessionId: session.Id, 
          userId: session.UserId 
        } 
      }));
    }  
  }
  return documents;
}

@Injectable()
export class LlmService implements OnModuleInit {
  private crc: ConversationalRetrievalQAChain | null = null;
  private conversationChain: ConversationChain | null = null;
  private executor?: AgentExecutor | null = null;
  private agent?: Agent | null = null;
  public isInitialized: boolean = false;

  constructor(
    @Inject("OpenAI") private readonly model: OpenAI,
    @Inject("ChatOpenAI") private readonly chat: ChatOpenAI,
    // @Inject("ChatStore") private readonly chatStore: VectorStore,
    // @Inject("CoachingStore") private readonly coachingStore: VectorStore,
    // @Inject("ArnoldStore") private readonly arnoldStore: VectorStore,
    @Inject("SessionCollection") private readonly sessionCollection: Collection<Session>
    ) {}

  async onModuleInit(): Promise<void> {
    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        // "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
        // "The following is a conversation between a human and an AI. The AI only answers questions with \"Yes\" or \"No\"."
        // "The following is a conversation between a human and their life-coach, the Austrian-American actor and retired governor Arnold Schwarzenegger. Arnold always aims to be helpful, providing support and direction where possible. Arnold asks questions that brings the human closer to its immediate and long term goals, while purely embodying the personality of actor Arnold Schwarzenegger."
        // "Conversation between a human with little direction in life and Arnold Schwarzenegger (badass Austrian-American actor and governor):"
        // "The following is a conversation between a human and their life-coach, the Austrian-American actor and retired governor Arnold Schwarzenegger. Arnold, although a total badass, always aims to be helpful, providing support and direction where possible. Arnold asks questions that brings the human closer to its immediate and long term goals, while purely embodying the personality of actor Arnold Schwarzenegger. Arnold always keeps is answers short and concise, and often refers to his experiences in body-building and acting."   
        `You are in a conversation with Arnold Schwarzenegger, who is acting as your life coach. Arnold's goal is to help you achieve your immediate and long-term goals by asking questions that provide support and direction. His responses should be short and concise, drawing on his experiences in body-building and acting for inspiration.

        Please engage in a dialogue with Arnold where he asks you relevant questions about your goals, interests, strengths, and weaknesses. You should respond honestly and openly, providing details that will help him guide you towards achieving your desired outcomes.
        
        Arnold may also offer advice based on his own experiences or observations but always keeping the focus on helping you reach your goals. Please note that the tone of the conversation should reflect Arnold's personality - supportive, direct, and focused on success, while providing plenty of Arnold Schwarzenegger quotes in a fun and engaging fashion.`
      ),
      // new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("Coachee: {input} \n Arnold Schwarznegger: "),
    ]);

    this.conversationChain = new ConversationChain({
      // memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
      prompt: chatPrompt,
      llm: this.chat,
    });

    // const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    // const docs = await textSplitter.createDocuments(["Some text here"]);
    /* Create the vectorstore */
    // const vectorStore = await Chroma.fromDocuments(docs, new OpenAIEmbeddings(), {
    //   collectionName: "goldel-escher-bach",
    // });
    // const vectorStore = await Chroma.fromExistingCollection(
    //   new OpenAIEmbeddings(),If provided, the ConversationalRetrievalQAChain will use this template to format a response before returning the result. This can be useful if you want to customize
    //   {
    //     collectionName: "chats",
    //   }
    // );

    // /* Create the chain */
    // this.crc = ConversationalRetrievalQAChain.fromLLM(
    //   this.model,

    //   this.vectorStore.asRetriever()
    // );
    // this.crc.memory = new BufferMemory({ returnMessages: true, memoryKey: "history" });

    // const tools = [
    //   // new SerpAPI(process.env["SERPAPI_API_KEY"], {
    //   //   location: "Austin,Texas,United States",
    //   //   hl: "en",
    //   //   gl: "us",
    //   // }),
    //   new ChainTool({
    //     name: "previous-conversations-chain",
    //     description:
    //       "Previous conversations chain",
    //     chain: VectorDBQAChain.fromLLM(this.model, this.chatStore), 
    //   }),
    //   new ChainTool({
    //     name: "arnold-chain",
    //     description:
    //       "Arnold Schwarznegger chain",
    //     chain: VectorDBQAChain.fromLLM(this.model, this.arnoldStore), 
    //   }),
    //   new ChainTool({
    //     name: "coaching-chain",
    //     description:
    //       "Coaching chain",
    //     chain: VectorDBQAChain.fromLLM(this.model, this.coachingStore), 
    //   })
    // ];
    // const llmChain = new LLMChain({
    //   prompt: chatPrompt,
    //   llm: this.chat,
    // });
    // const agent = new ZeroShotAgent({
    //   llmChain,
    //   allowedTools: tools.map((tool) => tool.name),
    // });
    // this.executor = AgentExecutor.fromAgentAndTools({ agent, tools });

    this.isInitialized = true;
  }

  async call(prompt: string) {
    return await this.model.call(prompt)
  }

  async getInitialMessage() {
    if (!this.isInitialized) {
      throw new InternalServerErrorException();
    }
    return "Something needs to go here! Get and synthesise something about the last session.";
  }  

  async chain(session: Session): Promise<string> {
    if (!this.isInitialized) {
      throw new InternalServerErrorException();
    }
    let conversation = "";
    conversation = session.Messages.map(message => 
      {
        conversation = conversation.concat(
          `${message.sender === Sender.User 
            ? "User" 
            : "Arnold Schwarzenegger"}: ${message.text}`)
          return conversation;
      })
      .join("\n")
      .concat("\n Arnold Schwarzenegger: ");
    return (await this.conversationChain?.call({input: conversation })).response as string;
  }

  async storeSession(session: Session) {
    // this.chatStore.addDocuments(await createDocumentsFromSession(session));
  }
}