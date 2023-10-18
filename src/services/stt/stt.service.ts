import { Injectable } from '@nestjs/common';
import { WhisperService } from './models/whisper.service';

type Models = 'whisper';

@Injectable()
export class STTService {
  constructor(private whisper: WhisperService) {}

  async processAudio(model: Models, audio: Express.Multer.File): Promise<string> {
    let resText = '';

    if (model === 'whisper') {
      resText = await this.whisper.convertAudioToText(audio);
    }

    return resText;
  }
}
