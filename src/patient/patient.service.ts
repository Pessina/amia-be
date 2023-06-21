import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePatientDto } from './dto/create-patient-dto';
import { Patient, Prisma } from '@prisma/client';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  async createPatient(doctorId: number, data: CreatePatientDto) {
    return this.prisma.patient.create({
      data: {
        assignedId: data.assignedId,
        name: data.name,
        Doctor: {
          connect: {
            id: doctorId,
          },
        },
      },
    });
  }

  async searchPatients(
    doctorId: number,
    id?: string,
    name?: string,
  ): Promise<Patient[]> {
    const where: Prisma.PatientWhereInput = {};

    where['doctorId'] = doctorId;

    if (id !== undefined) {
      where['assignedId'] = {
        contains: id,
      };
    }
    if (name) {
      where['name'] = {
        contains: name,
      };
    }
    return this.prisma.patient.findMany({ where });
  }
}
