import { Module } from '@nestjs/common';
import { PineconeClient } from '@pinecone-database/pinecone';
import { OpenAI } from 'langchain';
import { ChatOpenAI } from "langchain/chat_models";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Chroma } from 'langchain/vectorstores/chroma';
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { ChatController } from './chat.controller.js';
import { LlmService } from './llm.service.js';

const chatCollection = "chats";

@Module({
    controllers: [ChatController],
    providers: [
        {
          provide: "VectorStore",
          useFactory: async () => {
            // Return Chroma by default
            if (process.env["VECTOR_STORE"] === undefined) {
              throw new Error("VectorStore not defined");
            }
            if (process.env["VECTOR_STORE"].toLowerCase() === "pinecone") {
              const client = new PineconeClient();
              await client.init({
                apiKey: process.env.PINECONE_API_KEY,
                environment: process.env.PINECONE_ENVIRONMENT,
              });
              const pineconeIndex = client.Index(chatCollection);
              return PineconeStore.fromExistingIndex(
                new OpenAIEmbeddings(),
                { pineconeIndex }
              );
            }
            // Return Chroma by default
            return await Chroma.fromExistingCollection(
                new OpenAIEmbeddings(),
                { collectionName: chatCollection }
              );
          }
        },
        {
          provide: 'OpenAI',
          useFactory: () => {
            return new OpenAI(
              { 
                temperature: 1,
                modelName: process.env["OPENAI_MODEL"]
              });
          },
        },
        {
          provide: 'ChatOpenAI',
          useFactory: () => {
            return new ChatOpenAI(
            { 
              temperature: 1,
              modelName: process.env["OPENAI_MODEL"]
            })
          }
        },
        LlmService,
      ],
    exports: [ChatModule]
})
export class ChatModule {}