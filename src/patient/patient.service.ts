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
    if (!doctorId) {
      return [];
    }

    const where: Prisma.PatientWhereInput = { doctorId: doctorId };

    const orConditions = [];
    if (assignedId) {
      orConditions.push({ assignedId: { contains: assignedId } });
    }

    if (name) {
      orConditions.push({ name: { contains: name } });
    }

    if (orConditions.length > 0) {
      where['OR'] = orConditions;
    }

    return this.prisma.patient.findMany({ where });
  }

  async getPatientById(patientId: number): Promise<Patient | null> {
    return this.prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });
  }
}
