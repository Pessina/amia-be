import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VisitService } from './visit.service';
import { ChatGptService } from 'src/services/llm/models/gpt.service';

@Controller('visit')
export class VisitController {
  constructor(private visit: VisitService, private gpt: ChatGptService) {}

  @Post('process-audio')
  @UseInterceptors(FileInterceptor('audio'))
  async processAudio(@UploadedFile() audio: Express.Multer.File): Promise<string> {
    return await this.visit.processAudio(audio);
  }
}
