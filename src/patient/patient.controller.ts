import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient-dto';
import { Patient } from '@prisma/client';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  async createPatient(@Body() patientData: CreatePatientDto) {
    return this.patientService.createPatient(patientData);
  }

  @Get('search')
  async getPatients(
    @Query('id') id: string,
    @Query('name') name: string,
  ): Promise<Patient[]> {
    return this.patientService.getPatients(id, name);
  }
}
