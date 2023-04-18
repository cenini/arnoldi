import { Injectable, Inject, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { ConversationChain, LLMChain, ConversationalRetrievalQAChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { ChatPromptTemplate, SystemMessagePromptTemplate, MessagesPlaceholder, HumanMessagePromptTemplate } from 'langchain/prompts';
import { Agent, AgentExecutor, ChatAgent, initializeAgentExecutor, ZeroShotAgent } from 'langchain/agents';
import { ChatGPTPluginRetriever } from 'langchain/retrievers';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { VectorStore } from 'langchain/vectorstores/base';

@Injectable()
export class LlmService implements OnModuleInit {
  private crc: ConversationalRetrievalQAChain | null = null;
  private conversationChain: ConversationChain | null = null;
  private agentExecutor?: AgentExecutor | null = null;
  private agent?: Agent | null = null;
  public isInitialized: boolean = false;

  constructor(
    @Inject('OpenAI') private readonly model: OpenAI,
    @Inject('ChatOpenAI') private readonly chat: ChatOpenAI,
    @Inject('VectorStore') private readonly vectorStore: VectorStore
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
        
        Arnold may also offer advice based on his own experiences or observations but always keeping the focus on helping you reach your goals. Please note that the tone of the conversation should reflect Arnold's personality - supportive, direct, and focused on success.`
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);

    this.conversationChain = new ConversationChain({
      memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
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
    //   new OpenAIEmbeddings(),
    //   {
    //     collectionName: "chats",
    //   }
    // );

    /* Create the chain */
    this.crc = ConversationalRetrievalQAChain.fromLLM(
      this.model,
      this.vectorStore.asRetriever()
    );

    this.isInitialized = true;
  }

  async call(prompt: string) {
    return await this.model.call(prompt)
  }

  async chain(input: string) {
    if (!this.isInitialized) {
      throw new InternalServerErrorException();
    }
    // Make a prompt that aligns GPT with something Arnold related - like lifting weights, body building, acting or killing robots
    return await this.conversationChain?.call({input: `Human: ${input} \n Arnold Schwarzenegger: `});
    // return await this.crc?.call({input: `Human: ${input} \n Arnold Schwarzenegger: `});
  }  
}