import { Controller, Injectable, Req, Body, Get, Post, Module, Logger, RawBodyRequest, ValidationPipe} from '@nestjs/common';
import { OpenAI } from "langchain/llms";

@Injectable()
export class LlmService {
  constructor(
    private readonly model: OpenAI = new OpenAI({ temperature: 0.9 })
    ) {}
//   private readonly model: OpenAI = new OpenAI({ temperature: 0.9 });

  call(prompt: string) {
    return this.model.call(prompt)
  }
}