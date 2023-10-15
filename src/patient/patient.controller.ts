import { Controller, Post, Body, Get, Query, UseGuards, Req, Param, Delete } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient-dto';
import { Patient } from '@prisma/client';
import { AppAuthGuard } from 'src/auth/guard';
import { ApiBody } from '@nestjs/swagger';
import { AuthRequest } from 'src/types/AuthRequest';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiBody({ type: CreatePatientDto })
  @UseGuards(AppAuthGuard)
  @Post()
  async createPatient(
    @Req() req: AuthRequest,
    @Body() patientData: CreatePatientDto,
  ): Promise<Patient> {
    return this.patientService.createPatient(req.user.id, patientData);
  }

  @UseGuards(AppAuthGuard)
  @Delete(':patientId')
  async deletePatient(@Param('patientId') patientId: string): Promise<void> {
    await this.patientService.deletePatient(parseInt(patientId));
  }

  @UseGuards(AppAuthGuard)
  @Get('search')
  async searchPatients(
    @Req() req: AuthRequest,
    @Query('assignedId') assignedId: string,
    @Query('name') name: string,
  ): Promise<Patient[]> {
    return this.patientService.searchPatients(req.user.id, assignedId, name);
  }

  @UseGuards(AppAuthGuard)
  @Get(':patientId')
  async getPatient(@Param('patientId') patientId: string): Promise<Patient | null> {
    return this.patientService.getPatientById(parseInt(patientId));
  }
}
