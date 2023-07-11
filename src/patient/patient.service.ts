import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePatientDto } from './dto/create-patient-dto';
import { Patient, Prisma } from '@prisma/client';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  async createPatient(doctorId: number, data: CreatePatientDto): Promise<Patient> {
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

  async searchPatients(doctorId: number, assignedId?: string, name?: string): Promise<Patient[]> {
    console.log('called');
    const where: Prisma.PatientWhereInput = {
      doctorId: doctorId,
    };

    if (assignedId) {
      where['assignedId'] = { contains: assignedId };
    }

    if (name) {
      where['name'] = { contains: name };
    }

    return this.prisma.patient.findMany({ where });
  }

  async getPatientById(patientId: number): Promise<Patient | null> {
    console.log({ patientId });
    return this.prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });
  }
}
