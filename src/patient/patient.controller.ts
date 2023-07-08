import { Controller, Post, Body, Get, Query, UseGuards, Req, Param } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient-dto';
import { Patient } from '@prisma/client';
import { AppAuthGuard } from 'src/auth/guard';
import { ApiBody } from '@nestjs/swagger';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiBody({ type: CreatePatientDto })
  @UseGuards(AppAuthGuard)
  @Post()
  async createPatient(@Req() req: any, @Body() patientData: CreatePatientDto): Promise<Patient> {
    return this.patientService.createPatient(req.user.id, patientData);
  }

  @UseGuards(AppAuthGuard)
  @Get('search')
  async searchPatients(
    @Req() req: any,
    @Query('assignedId') assignedId: string,
    @Query('name') name: string
  ): Promise<Patient[]> {
    return this.patientService.searchPatients(req.user.id, assignedId, name);
  }

  @UseGuards(AppAuthGuard)
  @Get(':patientId')
  async getPatient(@Param('patientId') patientId: string): Promise<Patient | null> {
    return this.patientService.getPatientById(parseInt(patientId));
  }
}
