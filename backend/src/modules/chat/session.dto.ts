import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Message, Sender, Session } from './Session.js';

function senderDtoToObject(dto: SenderDto): Sender {
  return dto == SenderDto.User ? Sender.User : Sender.Ai;
}

export enum SenderDto {
  User,
  Ai
}

export class MessageDto  {
  @IsNotEmpty()
  @IsString()
  public text: string;
  @IsEnum(SenderDto)
  @IsNotEmpty()
  public sender: SenderDto;

  // add a timestamp like sentat

  static toObject(dto: MessageDto): Message {
    return {
      text: dto.text,
      sender: senderDtoToObject(dto.sender)
    }
  }
}

export class SessionDto {
  @IsNotEmpty()
  messages: MessageDto[];

  @IsUUID()
  @IsNotEmpty()
  public id!: string;
  @IsUUID()
  @IsNotEmpty()
  public userId!: string;

  // Add a timestamp like lastactive

  static toObject(dto: SessionDto): Session {
    return {
      Messages: dto.messages.map(m => MessageDto.toObject(m)),
      Id: dto.id,
      UserId: dto.userId
    };
  }
}

