import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class BaseDoctorDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  cpf: string;

  @IsString()
  @IsNotEmpty()
  crm: string;
}

export class CreateDoctorDto extends BaseDoctorDto {
  @IsNotEmpty()
  @IsString()
  firebaseUserUID: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  specialty: string;
}
