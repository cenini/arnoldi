// class BunServer implements RequestMethod {
//     // singleton bun server
//     private static server?: BunServer;

//     constructor() {
//         if (BunServer.server) {
//             throw new Error('DONT use this constructor to create bun server, try Server()');
//         }
//         BunServer.server = this;
//     }

//     static get instance() {
//         return BunServer.server ?? (BunServer.server = new BunServer());
//     }

//     private readonly requestMap: Map<string, Handler> = new Map<string, Handler>();
//     private readonly middlewares: Middleware[] = [];
//     private readonly errorHandlers: Handler[] = [];

//     get(path: string, ...handlers: Handler[]) {
//         this.delegate(path, "GET", handlers);
//     };

//     put(path: string, ...handlers: Handler[]) {
//         this.delegate(path, "PUT", handlers);
//     };

//     post(path: string, ...handlers: Handler[]) {
//         this.delegate(path, "POST", handlers);
//     };

//     delete(path: string, ...handlers: Handler[]) {
//         this.delegate(path, "DELETE", handlers);
//     };

//     options(path: string, ...handlers: Handler[]) {
//         this.delegate(path, "OPTIONS", handlers);
//     };
//  }     