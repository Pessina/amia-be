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
  ): Promise<string> {
    return await this.visit.processVisitRecording(
      req.user.email,
      audio,
      parseInt(patientId),
      requestTimestamp
    );
  }

  @Post('process-transcription')
  async processTranscription(@Body('transcription') transcription: string): Promise<string> {
    return await this.visit.processTranscription(transcription);
  }
}
