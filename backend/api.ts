import { OpenAI } from "langchain/llms";
import express, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from "body-parser";

const server: Express = express();
// server.use(bodyParser.urlencoded({
//   extended: false
// }));
// server.use(bodyParser.raw({ inflate: true, limit: '100kb', type: () => true }));
server.use(bodyParser.json({ inflate: true, limit: "100kb", type: "application/json" }))

export function getApi(model: OpenAI) {

  server.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server on Bun\n');
  }); 

  server.post("/coach", (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body.prompt)
    // Make an abstraction around model.call so I can mock it when I don't run in production
    model.call(req.body.prompt)
      .then(modelResult => {res.send(modelResult)})
      .catch(error => {
        res.status(500);
        res.send("Unknown internal error")
      })
  })

  return server;
}
