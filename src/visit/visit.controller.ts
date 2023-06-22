import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeepgramService } from '../services/stt/deepgram.service';
import { SpeechmaticsService } from '../services/stt/speechmatics.service';
import { WhisperService } from '../services/stt/whisper.service';
import { RevAiService } from '../services/stt/rev.ai';

@Controller('visit')
export class VisitController {
  constructor(
    private speechmatics: SpeechmaticsService,
    private deepgram: DeepgramService,
    private whisper: WhisperService,
    private revAi: RevAiService,
  ) {}

  @Post('process-audio')
  @UseInterceptors(FileInterceptor('audio'))
  async processAudio(
    @UploadedFile() audio: Express.Multer.File,
  ): Promise<string> {
    return await this.revAi.convertAudioToText(audio);
  }
}
