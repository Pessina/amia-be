import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePatientDto } from './dto/create-patient-dto';
import { Patient } from '@prisma/client';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  async createPatient(data: CreatePatientDto) {
    return this.prisma.patient.create({
      data: {
        id: data.id,
        name: data.name,
        Doctor: {
          connect: {
            id: data.doctorId,
          },
        },
      },
    });
  }

  async getPatients(id: string, name: string): Promise<Patient[]> {
    const where = {};
    if (id) {
      where['id'] = id;
    }
    if (name) {
      where['name'] = {
        contains: name,
        mode: 'insensitive',
      };
    }
    return this.prisma.patient.findMany({ where });
  }
}
