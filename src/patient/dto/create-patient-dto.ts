import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsOptional()
  assignedId?: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
