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
import { ApiBody } from '@nestjs/swagger';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiBody({ type: CreatePatientDto })
  @UseGuards(AppAuthGuard)
  @Post()
  async createPatient(@Request() req, @Body() patientData: CreatePatientDto) {
    return this.patientService.createPatient(patientData);
  }

  @UseGuards(AppAuthGuard)
  @Get('search')
  async searchPatients(
    @Request() req,
    @Query('id') id: string,
    @Query('name') name: string,
  ): Promise<Patient[]> {
    console.log(req.user);
    return this.patientService.searchPatients(
      req.user.firebaseUserUID,
      id,
      name,
    );
  }
}
