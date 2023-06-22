import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpeechmaticsService } from './services/speechmatics.service';
import { DeepgramService } from './services/deepgram.service';
import { WhisperService } from './services/whisper.service';

@Controller('visit')
export class VisitController {
  constructor(
    private speechmatics: SpeechmaticsService,
    private deepgram: DeepgramService,
    private whisper: WhisperService,
  ) {}

  @Post('process-audio')
  @UseInterceptors(FileInterceptor('audio'))
  async processAudio(
    @UploadedFile() audio: Express.Multer.File,
  ): Promise<string> {
    return await this.whisper.convertAudioToText(audio);
  }
}
