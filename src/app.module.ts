import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthStrategy } from './auth/strategy';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [DoctorModule, PatientModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, AuthStrategy],
})
export class AppModule {}
