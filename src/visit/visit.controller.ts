import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VisitService } from './visit.service';
import { AppAuthGuard } from 'src/auth/guard';
import { AuthRequest } from 'src/types/AuthRequest';
import { PatientVisitSummary } from 'src/services/llm/prompts/patientVisit.promp';
import { Visit } from '@prisma/client';
import { parseISO } from 'date-fns';
import { Response } from 'express';

@Controller('visit')
export class VisitController {
  constructor(private visit: VisitService) {}

  @UseGuards(AppAuthGuard)
  @Post('')
  async createVisit(
    @Body('patientId') patientId: string,
    @Body('timestamp') requestTimestamp: string
  ): Promise<Visit> {
    return await this.visit.createVisit(parseInt(patientId), parseISO(requestTimestamp));
  }

  @UseGuards(AppAuthGuard)
  @Get('patient/:patientId')
  async getAllVisitsForPatient(@Param('patientId') patientId: string): Promise<Visit[]> {
    return await this.visit.getAllVisitsForPatient(parseInt(patientId));
  }

  @UseGuards(AppAuthGuard)
  @Post('process-visit-recording')
  @UseInterceptors(FileInterceptor('audio'))
  async processVisitRecording(
    @Req() req: AuthRequest,
    @UploadedFile() audio: Express.Multer.File,
    @Body('patientId') patientId: string,
    @Body('timestamp') timestamp: string,
    @Body('timezone') timezone: string,
    @Res() res: Response
  ): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const keepAliveInterval = setInterval(() => {
      res.write('');
    }, 30000);

    const response = await this.visit.processVisitRecording(
      req.user.email,
      audio,
      parseInt(patientId),
      timestamp,
      timezone
    );

    res.write(JSON.stringify({ type: 'success', data: response }));

    clearInterval(keepAliveInterval);
    res.end();
  }

  // TODO: remove this endpoint, it's only for testing
  @UseGuards(AppAuthGuard)
  @Post('process-transcription')
  async processTranscription(
    @Body('transcription') transcription: string
  ): Promise<{ medicalRecord: PatientVisitSummary }> {
    return await this.visit.processTranscription(transcription);
  }
}
