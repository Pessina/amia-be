import { Controller, Post, Body, UseGuards, Delete, Req, Get } from '@nestjs/common';
import { CreateDoctorDto, BaseDoctorDto } from './dto/create-doctor.dto';
import { DoctorService } from './doctor.service';
import { AppAuthGuard } from 'src/auth/guard';
import { ApiBody } from '@nestjs/swagger';
import { Doctor } from '@prisma/client';
import { AuthRequest } from 'src/types/AuthRequest';

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

  @UseGuards(AppAuthGuard)
  @Delete()
  deleteDoctor(@Req() req: AuthRequest): Promise<void> {
    return this.doctorService.deleteDoctor(req.user.id);
  }

  @UseGuards(AppAuthGuard)
  @Get()
  async getDoctor(@Req() req: AuthRequest): Promise<Doctor> {
    return this.doctorService.getDoctor(req.user.id);
  }
}
