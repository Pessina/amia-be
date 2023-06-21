import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
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
  createDoctor(
    @Req() req,
    @Body() createDoctorDto: CreateDoctorDto,
  ): Promise<Doctor> {
    return this.doctorService.createDoctor({
      firebaseUserUID: req.user.user_id,
      email: req.user.email,
      data: createDoctorDto,
    });
  }
}
