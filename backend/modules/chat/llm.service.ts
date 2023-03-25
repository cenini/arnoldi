import { Injectable, Inject } from '@nestjs/common';
import { OpenAI } from "langchain/llms";

@Injectable()
export class LlmService {
  constructor(
    @Inject('OpenAI') private readonly model: OpenAI,
  ) {}

  call(prompt: string) {
    return this.model.call(prompt)
  }
}