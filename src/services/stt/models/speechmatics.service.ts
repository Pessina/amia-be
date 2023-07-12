import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { Readable } from 'stream';

@Injectable()
export class SpeechmaticsService {
  private baseURL = 'https://asr.api.speechmatics.com/v2/jobs';
  private headers = {
    Authorization: `Bearer ${process.env.SPEECHMATICS_API_KEY}`,
  };

  async convertAudioToText(file: Express.Multer.File): Promise<string> {
    const jobId = await this.createTranscriptionJob(file);
    const transcript = await this.getTranscript(jobId);

    return transcript;
  }

  private async createTranscriptionJob(file: Express.Multer.File) {
    const stream = this.createReadableStream(file.buffer);
    const formData = this.createFormData(stream, file.originalname);

    try {
      const response = await axios.post<{ id: string }>(this.baseURL, formData, {
        headers: {
          ...formData.getHeaders(),
          ...this.headers,
        },
      });

      return response.data.id;
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log('Error', error.message);
      }
    }
  }

  private createReadableStream(buffer: Buffer): Readable {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    return stream;
  }

  private createFormData(stream: Readable, filename: string): FormData {
    const formData = new FormData();
    formData.append('data_file', stream, filename);
    formData.append(
      'config',
      '{"type": "transcription","transcription_config": { "operating_point":"enhanced", "language": "pt" }}'
    );

    return formData;
  }

  private async getTranscript(jobId: string) {
    let isTranscriptReady = false;
    const transcriptUrl = `${this.baseURL}/${jobId}/transcript?format=txt`;

    while (!isTranscriptReady) {
      try {
        const response = await axios.get<string>(transcriptUrl, {
          headers: this.headers,
        });

        if (response.status === 200) {
          isTranscriptReady = true;
          return response.data;
        }
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
}
