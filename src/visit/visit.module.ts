import { Module } from '@nestjs/common';
import { VisitController } from './visit.controller';
import { VisitService } from './visit.service';
import { EmailService } from 'src/services/email/email.service';
import { LLMService } from 'src/services/llm/llm.service';
import { STTService } from 'src/services/stt/stt.service';

import { ChatGptService } from 'src/services/llm/models/gpt.service';
import { WhisperService } from 'src/services/stt/models/whisper.service';
import { AWSSESService } from 'src/services/email/providers/awsses.service';
import { PatientModule } from 'src/patient/patient.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [PatientModule],
  controllers: [VisitController],
  providers: [
    VisitService,
    EmailService,
    LLMService,
    STTService,
    ChatGptService,
    WhisperService,
    AWSSESService,
    PrismaService,
  ],
})
export class VisitModule {}
