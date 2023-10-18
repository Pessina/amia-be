import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class WhisperService {
  private baseURL =
    'https://nami-ai-whisper.openai.azure.com/openai/deployments/whisper/audio/transcriptions?api-version=2023-09-01-preview';
  private headers = {
    'api-key': `${process.env.AZURE_OPEN_AI_WHISPER_API_KEY}`,
  };

  async convertAudioToText(file: Express.Multer.File): Promise<string> {
    const formData = this.createFormData(file);

    try {
      const response = await axios.post<{ text: string }>(this.baseURL, formData, {
        headers: {
          ...formData.getHeaders(),
          ...this.headers,
        },
      });
      return response.data.text;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  private createFormData(file: Express.Multer.File): FormData {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    formData.append('model', 'whisper-1');
    formData.append('language', 'pt');
    formData.append('temperature', 0);

    return formData;
  }
}
