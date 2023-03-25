// console.log("Hello via Bun!");
// import { OpenAI } from "langchain/llms";
// import { getApi } from "./api.js"

// // process.env.NODE_ENV = "production";

// console.log(process.env.OPENAI_API_KEY);
// const model = new OpenAI({ temperature: 0.9 });

// const api = getApi(model);
// const port = 8080;
// api.listen(port, () => {
//   console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
// });

// // const server = Bun.serve({
// //     port: 3000,
// //     keyFile: "./key.pem", // path to TLS key
// //     certFile: "./cert.pem", // path to TLS cert
// //     passphrase: "super-secret", // optional passphrase
// //     fetch(req) {
// //       return new Response(`Bun!`);
// //     },
// //   });
  


// // const res = await model.call(
// //     "What would be a good company name a company that makes colorful socks?"
// //   );
// //   console.log({ res });
  

import { Controller, Injectable, Inject, Req, Body, Get, Post, Module, Logger, RawBodyRequest, ValidationPipe} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ChatModule } from './modules/chat/ChatModule.js'
// import { PromptDto } from './modules/chat/PromptDto.js'
// // import { CoachService } from './CoachService.js';
// // import { CoachService } from './CoachService.js'

// import { OpenAI } from "langchain/llms";
// @Injectable()
// export class CoachService {
//   constructor(
//     private readonly model: OpenAI = new OpenAI({ temperature: 0.9 })
//     ) {}
// //   private readonly model: OpenAI = new OpenAI({ temperature: 0.9 });

//   call(prompt: string) {
//     return this.model.call(prompt)
//   }
// }  

@Module({
//   controllers: [ChatController],
// //   imports: [CoachService]
//   providers: [CoachService],
// //   exports: [CoachService]
  imports: [ChatModule]
})
class AppModule {}

async function main () {
//   const app = await NestFactory.create(AppModule, {
//     logger: ['error', 'verbose', 'debug', 'warn']
//   });
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(8080);
  Logger.log('Server started on http://localhost:8080', 'NestApplication');
}

main();