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

    try {
      // const response = await this.visit.processVisitRecording(
      //   req.user.email,
      //   audio,
      //   parseInt(patientId),
      //   timestamp,
      //   timezone
      // );
      const response = {
        medicalRecord: {
          topics: [
            {
              title: 'Visit Summary',
              content: "Here's a summary of your visit",
            },
            {
              title: 'Visit Summary1',
              content: "Here's a summary of your visit",
            },
            {
              title: 'Visit Summary3',
              content: "Here's a summary of your visit",
            },
            {
              title: 'Visit Summary4',
              content: "Here's a summary of your visit",
            },
            {
              title: 'Visit Summary5',
              content: "Here's a summary of your visit",
            },
            {
              title: 'Visit Summary6',
              content: "Here's a summary of your visit",
            },
            {
              title: 'Visit Summary7',
              content: "Here's a summary of your visit",
            },
            {
              title: 'Visit Summary8',
              content: "Here's a summary of your visit",
            },
          ],
        },
      };

      res.write('event: success\n');
      res.write(`data: ${JSON.stringify(response)}\n\n`);
    } catch (error) {
      res.write('event: error\n');
      res.write(
        `data: ${JSON.stringify({
          errorCode: 'PROCESSING_ERROR',
          errorMessage: error.message,
          errorDetails: {
            reason: 'Failed to process visit recording',
          },
        })}\n\n`
      );
    } finally {
      res.end();
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
