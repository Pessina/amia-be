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
import { ChatGptService } from 'src/services/llm/models/gpt.service';
import { AppAuthGuard } from 'src/auth/guard';

@Controller('visit')
export class VisitController {
  constructor(private visit: VisitService, private gpt: ChatGptService) {}

  @UseGuards(AppAuthGuard)
  @Post('process-audio')
  @UseInterceptors(FileInterceptor('audio'))
  async processAudio(
    @Req() req: any,
    @UploadedFile() audio: Express.Multer.File,
    @Body('patientName') patientName: string,
    @Body('requestTimestamp') requestTimestamp: string
  ): Promise<string> {
    return await this.visit.processAudio(req.user.email, audio, patientName, requestTimestamp);
  }
}
