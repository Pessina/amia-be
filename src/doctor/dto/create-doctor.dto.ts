import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  firebaseUserUID: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  cpf: string;

  @IsString()
  @IsNotEmpty()
  crm: string;

  @IsString()
  @IsNotEmpty()
  specialty: string;
}
