import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient-dto';
import { Patient } from '@prisma/client';
import { AppAuthGuard } from 'src/auth/guard';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @UseGuards(AppAuthGuard)
  @Post()
  async createPatient(@Request() req, @Body() patientData: CreatePatientDto) {
    console.log(req.user);
    return this.patientService.createPatient(patientData);
  }

  @UseGuards(AppAuthGuard)
  @Get('search')
  async searchPatients(
    @Query('id') id: string,
    @Query('name') name: string,
  ): Promise<Patient[]> {
    return this.patientService.searchPatients(id, name);
  }
}
