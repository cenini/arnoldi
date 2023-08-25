import { Module } from '@nestjs/common';
import { OpenAI } from 'langchain';
import { ChatOpenAI } from "langchain/chat_models";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Chroma } from 'langchain/vectorstores/chroma';
import { ChatController } from './chat.controller.js';
import { LlmService } from './llm.service.js';
import { Collection, MongoClient } from 'mongodb';
import { Session } from './Session.js';

const chatCollection = "arnoldi-chats";
const coachingCollection = "arnoldi-coaching";
const arnoldCollection = "arnoldi-arnold";
const sessionsCollection = "sessions";

export async function buildExistingVectorStore(indexName: string): Promise<Chroma> {
  const chroma = new Chroma(new OpenAIEmbeddings(), { collectionName: indexName, numDimensions: 1536 });
  chroma.ensureCollection();
  return chroma;
}

export async function buildVectorStoreFromTexts(indexName: string, texts: string[], metadatas: object[]): Promise<Chroma> {
  return await Chroma.fromTexts(
    texts,
    metadatas,
    new OpenAIEmbeddings(),
    {
      collectionName: indexName,
    }
  );
}

@Module({
    controllers: [ChatController],
    providers: [
        {
          provide: "SessionCollection",
          useFactory: async () => {
            console.log(process.env["MONGO_CONNECTION_STRING"])
            const client = new MongoClient(process.env["MONGO_CONNECTION_STRING"]);
            await client.connect();
            const db = client.db("arnoldi");
            const collection: Collection<Session> = db.collection(sessionsCollection);
            await collection.createIndex({Id: 1}, { collation: { locale: "en"}})
            return collection;
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