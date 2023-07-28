import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePatientDto } from './dto/create-patient-dto';
import { Patient, Prisma } from '@prisma/client';
import { AppException } from 'src/filters/exceptions/AppException';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  async createPatient(doctorId: number, data: CreatePatientDto): Promise<Patient> {
    try {
      return await this.prisma.patient.create({
        data: {
          assignedId: data.assignedId || undefined,
          name: data.name,
          Doctor: {
            connect: {
              id: doctorId,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002' && error.meta.target.includes('assignedId')) {
        throw new AppException(
          {
            code: 'PATIENT_ASSIGNED_ID_DUPLICATE',
            meta: { target: ['assignedId'] },
            status: HttpStatus.BAD_REQUEST,
          },
          error
        );
      }

      throw error;
    }
  }

  async deletePatient(patientId: number): Promise<void> {
    await this.prisma.patient.delete({
      where: { id: patientId },
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

  async getPatientById(patientId: number): Promise<Patient> {
    const patient = await this.prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    if (!patient) {
      throw new Error(`Patient with id ${patientId} not found.`);
    }

    return patient;
  }
}
