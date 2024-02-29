import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';

export class MesssaDto {
  @IsString()
  content: string;

  @IsString()
  role: 'system' | 'user';

  @IsString()
  @IsOptional()
  name?: string;
}

export class MessagesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MesssaDto)
  messages: MesssaDto[];
}
