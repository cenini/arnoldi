import { Injectable, Inject, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { PineconeClient } from '@pinecone-database/pinecone';

@Injectable()
export class PineconeService implements OnModuleInit {
  public isInitialized: boolean = false;

  constructor(
    @Inject('Pinecone') private readonly pinecone: PineconeClient,
  ) {}

  async onModuleInit(): Promise<void>{
    await this.pinecone.createIndex({
      createRequest: {
        name: "chat",
        dimension: 1024,
      },
    });
    this.isInitialized = true;
  };
}