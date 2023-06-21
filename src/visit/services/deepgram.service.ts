import { Injectable } from '@nestjs/common';
import { Deepgram } from '@deepgram/sdk';
import { TranscriptionSource } from '@deepgram/sdk/dist/types';
import { Readable } from 'stream';

@Injectable()
export class DeepgramService {
  private deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);

  async convertAudioToText(file: Express.Multer.File): Promise<string> {
    const source = this.createAudioSource(file);
    const transcript = await this.transcribeAudio(source);

    return transcript;
  }

  private async transcribeAudio(source: TranscriptionSource) {
    try {
      const response = await this.deepgram.transcription.preRecorded(source, {
        smart_format: true,
        model: 'nova',
        // language: 'pt-BR', // Only available on paid version
      });

      if ('results' in response) {
        return response.results.channels[0].alternatives[0].transcript;
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  private createAudioSource(file: Express.Multer.File) {
    const stream = new Readable();
    stream.push(file.buffer);
    stream.push(null);

    return { buffer: file.buffer, mimetype: file.mimetype };
  }

  private handleError(error: any): void {
    if (error.response) {
      console.log(error.response.data);
    } else {
      console.log('Error', error.message);
    }
  }
}
