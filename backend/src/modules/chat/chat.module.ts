import { Module } from '@nestjs/common';
import { PineconeClient } from '@pinecone-database/pinecone';
import { OpenAI } from 'langchain';
import { ChatOpenAI } from "langchain/chat_models";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { VectorStore } from 'langchain/vectorstores/base';
import { Chroma } from 'langchain/vectorstores/chroma';
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { ChatController } from './chat.controller.js';
import { LlmService } from './llm.service.js';
import { Collection, MongoClient } from 'mongodb';
import { Session } from '../models/Session.js';

const chatCollection = "arnoldi-chats";
const coachingCollection = "arnoldi-coaching";
const arnoldCollection = "arnoldi-arnold";
const sessionsCollection = "sessions";
// 1536
export async function buildExistingVectorStore(indexName: string): Promise<Chroma> {
  // // Return Chroma by default
  // if (process.env["VECTOR_STORE"] === undefined) {
  //   throw new Error("VectorStore not defined");
  // }
  // if (process.env["VECTOR_STORE"].toLowerCase() === "pinecone") {
  //   const client = new PineconeClient();
  //   await client.init({
  //     apiKey: process.env.PINECONE_API_KEY,
  //     environment: process.env.PINECONE_ENVIRONMENT,
  //   });
  //   const pineconeIndex = client.Index(indexName);
  //   return PineconeStore.fromExistingIndex(
  //     new OpenAIEmbeddings(),
  //     { pineconeIndex }
  //   );
  // }
  // Return Chroma by default
  const chroma = new Chroma(new OpenAIEmbeddings(), { collectionName: indexName, numDimensions: 1536 });
  chroma.ensureCollection();
  return chroma;
}

export async function buildVectorStoreFromTexts(indexName: string, texts: string[], metadatas: object[]): Promise<Chroma> {
  // // Return Chroma by default
  // if (process.env["VECTOR_STORE"] === undefined) {
  //   throw new Error("VectorStore not defined");
  // }
  // if (process.env["VECTOR_STORE"].toLowerCase() === "pinecone") {
  //   const client = new PineconeClient();
  //   await client.init({
  //     apiKey: process.env.PINECONE_API_KEY,
  //     environment: process.env.PINECONE_ENVIRONMENT,
  //   });
  //   const pineconeIndex = client.Index(indexName);
  //   return PineconeStore.fromTexts(
  //     texts,
  //     metadatas,
  //     new OpenAIEmbeddings(),
  //     { pineconeIndex }
  //   );
  // }
  // // text sample from Godel, Escher, Bach
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
          provide: "ChatStore",
          useFactory: async () => 
          { 
            // return await buildVectorStoreFromTexts(chatCollection, ["Blabla"]);
            return await buildExistingVectorStore(chatCollection);
          }
        },
        {
          provide: "CoachingStore",
          useFactory: async () => 
          { 
            const vectorStore = await buildExistingVectorStore(coachingCollection);
            // Add the book "Total Recall: My Unbelievably True Life Story" to the collection
            // vectorStore.addDocuments()
            return vectorStore;
          }
        },
        {
          provide: "ArnoldStore",
          useFactory: async () => { return await buildExistingVectorStore(arnoldCollection) }
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