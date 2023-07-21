import { Injectable } from '@nestjs/common';
import { WhisperService } from './models/whisper.service';
import { SpeechmaticsService } from './models/speechmatics.service';

import { RevAiService } from './models/rev.ai';

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

    if (model === 'whisper') {
      resText = await this.whisper.convertAudioToText(audio);
    }
    if (model === 'speechmatics') {
      resText = await this.speechmatics.convertAudioToText(audio);
    }
    if (model === 'rev') {
      resText = await this.rev.convertAudioToText(audio);
    }

    return resText;
  }
}
