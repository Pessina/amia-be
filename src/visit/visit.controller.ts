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
import { SSEHandler } from 'src/utils/sse-handler';

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
    const sse = new SSEHandler(res);

    sse.startKeepAlive(1000);

    try {
      const response = await this.visit.processVisitRecording(
        req.user.email,
        audio,
        parseInt(patientId),
        timestamp,
        timezone
      );

      sse.sendMessage({
        data: { type: 'success', data: response },
      });
    } catch (error) {
      sse.sendMessage({
        data: { type: 'error', message: error.message },
      });
    } finally {
      sse.closeConnection();
    }
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
