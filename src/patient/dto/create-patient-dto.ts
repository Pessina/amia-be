import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  assignedId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
