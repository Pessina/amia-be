import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class BaseDoctorDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  @Matches(/^[0-9]+$/)
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
