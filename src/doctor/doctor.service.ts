import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDoctorDto, BaseDoctorDto } from './dto/create-doctor.dto';
import { Doctor } from '@prisma/client';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

  async createDoctor(doctorDto: CreateDoctorDto): Promise<Doctor> {
    const doctor = await this.prisma.doctor.create({
      data: doctorDto,
    });

    return doctor;
  }

  async existDoctor(doctorDto: BaseDoctorDto): Promise<boolean> {
    const { email, crm, cpf } = doctorDto;

    const doctorWithEmail = await this.prisma.doctor.findUnique({
      where: { email },
    });
    const doctorWithCrm = await this.prisma.doctor.findUnique({
      where: { crm },
    });
    const doctorWithCpf = await this.prisma.doctor.findUnique({
      where: { cpf },
    });

    if (doctorWithEmail || doctorWithCrm || doctorWithCpf) {
      return true;
    }

    return false;
  }

  async deleteDoctor(id: number): Promise<void> {
    await this.prisma.doctor.delete({
      where: { id },
    });
  }
}
