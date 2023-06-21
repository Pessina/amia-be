import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpeechmaticsService } from './services/speechmatics.service';

@Controller('visit')
export class VisitController {
  constructor(private speechmatics: SpeechmaticsService) {}

  @Post('process-audio')
  @UseInterceptors(FileInterceptor('audio'))
  async processAudio(
    @UploadedFile() audio: Express.Multer.File,
  ): Promise<string> {
    return await this.speechmatics.convertAudioToText(audio);
  }
}
