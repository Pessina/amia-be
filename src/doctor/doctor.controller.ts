import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorService } from './doctor.service';
import { FirebaseAuthGuard } from 'src/auth/guard';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  createDoctor(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorService.createDoctor(createDoctorDto);
  }
}
