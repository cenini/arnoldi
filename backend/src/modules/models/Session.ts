import { ObjectId } from "mongodb";

export interface Session {
  Messages: Message[];
  Id: string;
  UserId: string;
}

export interface Message {
  text: string;
  sender: Sender;
}

export enum Sender {
  User,
  Ai
}