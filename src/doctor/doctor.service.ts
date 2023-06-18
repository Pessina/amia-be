import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

  async createDoctor(data: CreateDoctorDto) {
    const doctor = await this.prisma.doctor.create({
      data,
    });

    return doctor;
  }
}
