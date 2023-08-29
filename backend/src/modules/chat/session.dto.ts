import { IsNotEmpty, IsEnum, IsString, IsUUID } from 'class-validator';
import { Message, Sender, Session } from './Session.js';
import { HttpException, HttpStatus } from '@nestjs/common';

function senderDtoToObject(dto: SenderDto): Sender {
  return dto == SenderDto.User ? Sender.User : Sender.Ai;
}

export enum SenderDto {
  User,
  Ai,
}

export class MessageDto {
  @IsNotEmpty()
  @IsString()
  public text: string;
  @IsEnum(SenderDto)
  @IsNotEmpty()
  public sender: SenderDto;

  public constructor(init?: Partial<MessageDto>) {
    Object.assign(this, init);
  }

  // add a timestamp like sentat

  static toObject(dto: MessageDto): Message {
    return {
      text: dto.text,
      sender: senderDtoToObject(dto.sender),
    };
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

  public constructor(init?: Partial<SessionDto>) {
    Object.assign(this, init);
  }

  // Add a timestamp like lastactive

  static toObject(dto: SessionDto): Session {
    try {
      return {
        Messages: dto.messages.map((m) => MessageDto.toObject(m)),
        Id: dto.id,
        UserId: dto.userId,
      };
    } catch (e) {
      throw new HttpException(
        'Could not create session from request',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
