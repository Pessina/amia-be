import { IsNotEmpty } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  doctorId: number;
}
