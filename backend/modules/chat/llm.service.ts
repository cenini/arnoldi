import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { OpenAI } from "langchain/llms";
import { ChatOpenAI } from "langchain/chat_models";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { ConversationChain, LLMChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { ChatPromptTemplate, SystemMessagePromptTemplate, MessagesPlaceholder, HumanMessagePromptTemplate } from 'langchain/prompts';
import { Calculator, SerpAPI } from 'langchain/tools';
import { Agent, AgentExecutor, ChatAgent, initializeAgentExecutor, ZeroShotAgent } from 'langchain/agents';

// const chat = new ChatOpenAI({ temperature: 0 });

@Injectable()
export class LlmService implements OnModuleInit {
  private conversationChain: ConversationChain | null = null;
  private agentExecutor?: AgentExecutor | null = null;
  private agent?: Agent | null = null;
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

    //// Should make some kind of agent here eventually... so it can use other tools as well.
    // this.agent = new ZeroShotAgent({llmChain: this.conversationChain, allowedTools: ["search", "calculator"]})
    // this.agentExecutor = AgentExecutor.fromAgentAndTools({agent: this.agent, tools: tools});

    // // Define the list of tools the agent can use
    // const tools = [new SerpAPI("")];
    // // const agent = ChatAgent.fromLLMAndTools(this.chat, tools);
    // // this.agentExecutor = AgentExecutor.fromAgentAndTools({ 
    // //   agent, 
    // //   tools, 
    // //   prompt: chatPrompt,
    // //   memory: new BufferMemory({ returnMessages: true, memoryKey: "history" })});
    // this.agentExecutor = await initializeAgentExecutor(
    //   tools,
    //   this.chat,
    //   "chat-conversational-react-description",
    //   true
    // );
    // this.agentExecutor.memory = new BufferMemory({
    //   returnMessages: true,
    //   memoryKey: "chat_history",
    //   inputKey: "input",
    // });

    this.isInitialized = true;
  }

  async call(prompt: string) {
    return await this.model.call(prompt)
  }

  async chain(input: string) {
    return await this.conversationChain?.call({input})
  }  
}