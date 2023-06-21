import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  assignedId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  doctorId: string;
}
