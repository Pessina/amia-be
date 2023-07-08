import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class WhisperService {
  private baseURL = 'https://api.openai.com/v1/audio/transcriptions';
  private headers = {
    Authorization: `Bearer ${process.env.OPEAN_AI_WHISPER_API_KEY}`,
  };

  async convertAudioToText(file: Express.Multer.File): Promise<string> {
    const formData = this.createFormData(file);

    try {
      const response = await axios.post(this.baseURL, formData, {
        headers: {
          ...formData.getHeaders(),
          ...this.headers,
        },
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private createFormData(file: Express.Multer.File): FormData {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    formData.append('model', 'whisper-1');

    return formData;
  }

  private handleError(error: AxiosError): void {
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error('Error', error.message);
    }
  }
}
