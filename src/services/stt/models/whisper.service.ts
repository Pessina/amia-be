import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class WhisperService {
  private baseURL = 'https://api.openai.com/v1/audio/transcriptions';
  private headers = {
    Authorization: `Bearer ${process.env.OPEAN_AI_API_KEY}`,
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
