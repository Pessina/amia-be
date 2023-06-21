import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

  async createDoctor(data: {
    firebaseUserUID: string;
    email: string;
    data: CreateDoctorDto;
  }) {
    const doctor = await this.prisma.doctor.create({
      data: {
        ...data.data,
        email: data.email,
        firebaseUserUID: data.firebaseUserUID,
      },
    });

    return doctor;
  }
}
