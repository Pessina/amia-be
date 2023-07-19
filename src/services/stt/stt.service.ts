import { HttpStatus, Injectable } from '@nestjs/common';
import { WhisperService } from './models/whisper.service';
import { SpeechmaticsService } from './models/speechmatics.service';

import { RevAiService } from './models/rev.ai';
import { AppException } from 'src/filters/exceptions/AppException';

type Models = 'whisper' | 'speechmatics' | 'rev';

@Injectable()
export class STTService {
  constructor(
    private whisper: WhisperService,
    private speechmatics: SpeechmaticsService,
    private rev: RevAiService
  ) {}

  async processAudio(model: Models, audio: Express.Multer.File): Promise<string> {
    let resText = '';

    try {
      if (model === 'whisper') {
        resText = await this.whisper.convertAudioToText(audio);
      }
      if (model === 'speechmatics') {
        resText = await this.speechmatics.convertAudioToText(audio);
      }
      if (model === 'rev') {
        resText = await this.rev.convertAudioToText(audio);
      }
    } catch (error) {
      console.error(`Failed to process STT: ${error}`);
      throw new AppException(
        {
          code: 'STT_PROCESSING_FAILED',
          meta: { target: ['STT'] },
          message: 'Failed to process STT',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    return resText;
  }
}
