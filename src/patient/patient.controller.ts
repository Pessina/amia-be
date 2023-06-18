import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient-dto';
import { Patient } from '@prisma/client';
import { FirebaseAuthGuard } from 'src/auth/guard';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  async createPatient(@Body() patientData: CreatePatientDto) {
    return this.patientService.createPatient(patientData);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('search')
  async searchPatients(
    @Query('id') id: string,
    @Query('name') name: string,
  ): Promise<Patient[]> {
    return this.patientService.searchPatients(id, name);
  }
}
