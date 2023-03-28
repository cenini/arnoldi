import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PromptDto {
  @IsString()
  @IsNotEmpty()
  public text!: string;
}
