import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class PromptDto {
  @IsString()
  @IsNotEmpty()
  public text!: string;

  @IsUUID()
  @IsNotEmpty()
  public sessionId!: string;
}
