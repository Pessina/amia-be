import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateDoctorDto, BaseDoctorDto } from './dto/create-doctor.dto';
import { DoctorService } from './doctor.service';
import { AppAuthGuard } from 'src/auth/guard';
import { ApiBody } from '@nestjs/swagger';
import { Doctor } from '@prisma/client';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @UseGuards(AppAuthGuard)
  @Post()
  @ApiBody({ type: CreateDoctorDto })
  createDoctor(@Body() doctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorService.createDoctor(doctorDto);
  }

  @Post('exist')
  @ApiBody({ type: BaseDoctorDto })
  async existDoctor(@Body() doctorDto: BaseDoctorDto): Promise<boolean> {
    return this.doctorService.existDoctor(doctorDto);
  }
}
