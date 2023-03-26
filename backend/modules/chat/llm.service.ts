import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { OpenAI } from "langchain/llms";
import { ChatOpenAI } from "langchain/chat_models";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { ChatPromptTemplate, SystemMessagePromptTemplate, MessagesPlaceholder, HumanMessagePromptTemplate } from 'langchain/prompts';

// const chat = new ChatOpenAI({ temperature: 0 });

@Injectable()
export class LlmService implements OnModuleInit {
  private conversationChain: ConversationChain | null = null;
  public isInitialized: boolean = false;

  constructor(
    @Inject('OpenAI') private readonly model: OpenAI,
    @Inject('ChatOpenAI') private readonly chat: ChatOpenAI
  ) {}

  async onModuleInit(): Promise<void> {
    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        // "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
        // "The following is a conversation between a human and an AI. The AI only answers questions with \"Yes\" or \"No\"."
        "The following is a conversation between a human and its AI life coach. The AI always aims to be helpful, providing support and direction where possible. The AI asks questions that brings the human closer to its immediate and long term goals."
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);
    
    this.conversationChain = new ConversationChain({
      memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
      prompt: chatPrompt,
      llm: this.chat,
    });

    this.isInitialized = true;
  }

  async call(prompt: string) {
    return await this.model.call(prompt)
  }

  async chain(prompt: string) {
    return await this.conversationChain?.call({input: prompt})
  }  
}