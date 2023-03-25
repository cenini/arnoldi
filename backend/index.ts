console.log("Hello via Bun!");
import { OpenAI } from "langchain/llms";
import { getApi } from "./api.js"

// process.env.NODE_ENV = "production";

console.log(process.env.OPENAI_API_KEY);
const model = new OpenAI({ temperature: 0.9 });

const api = getApi(model);
const port = 8080;
api.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// const server = Bun.serve({
//     port: 3000,
//     keyFile: "./key.pem", // path to TLS key
//     certFile: "./cert.pem", // path to TLS cert
//     passphrase: "super-secret", // optional passphrase
//     fetch(req) {
//       return new Response(`Bun!`);
//     },
//   });
  


// const res = await model.call(
//     "What would be a good company name a company that makes colorful socks?"
//   );
//   console.log({ res });
  