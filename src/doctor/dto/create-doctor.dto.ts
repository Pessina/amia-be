import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  firebaseUserId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  crm: string;

  @IsString()
  @IsNotEmpty()
  specialty: string;
}
