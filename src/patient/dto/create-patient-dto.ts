import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  assignedId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
