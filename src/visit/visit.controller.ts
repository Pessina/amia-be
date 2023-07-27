import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VisitService } from './visit.service';
import { AppAuthGuard } from 'src/auth/guard';
import { AuthRequest } from 'src/types/AuthRequest';
import { ProcessVisitRecordingResponse } from './visit.types';
import { PatientVisitSummary } from 'src/services/llm/prompts/patientVisitPrompts';

@Controller('visit')
export class VisitController {
  constructor(private visit: VisitService) {}

  @UseGuards(AppAuthGuard)
  @Post('process-visit-recording')
  @UseInterceptors(FileInterceptor('audio'))
  async processVisitRecording(
    @Req() req: AuthRequest,
    @UploadedFile() audio: Express.Multer.File,
    @Body('patientId') patientId: string,
    @Body('requestTimestamp') requestTimestamp: string
  ): Promise<ProcessVisitRecordingResponse> {
    return await this.visit.processVisitRecording(
      req.user.email,
      audio,
      parseInt(patientId),
      requestTimestamp
    );
  }

  @UseGuards(AppAuthGuard)
  @Post('process-transcription')
  async processTranscription(
    @Body('transcription') transcription: string
  ): Promise<PatientVisitSummary> {
    return await this.visit.processTranscription(transcription);
  }
}
