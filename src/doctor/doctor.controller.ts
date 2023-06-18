import { Controller, Post, Body } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorService } from './doctor.service';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  createDoctor(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorService.createDoctor(createDoctorDto);
  }
}
