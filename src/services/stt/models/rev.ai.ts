import { Injectable } from '@nestjs/common';
import { RevAiApiClient } from 'revai-node-sdk';
import { promises as fs } from 'fs';
import { resolve } from 'path';

@Injectable()
export class RevAiService {
  private accessToken = process.env.REVAI_API_KEY;
  private client = new RevAiApiClient(this.accessToken);

  async convertAudioToText(file: Express.Multer.File): Promise<string> {
    const jobId = await this.createTranscriptionJob(file);
    const transcript = await this.getTranscript(jobId);

    return transcript;
  }

  private async createTranscriptionJob(file: Express.Multer.File): Promise<string> {
    const filePath = resolve(file.originalname);
    await fs.writeFile(filePath, file.buffer);

    try {
      const job = await this.client.submitJobLocalFile(filePath, {
        language: 'pt',
      });

      await fs.unlink(filePath);

      return job.id;
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
      } else {
        console.error('Error', error.message);
      }
    }
  }

  private async getTranscript(jobId: string): Promise<string> {
    let jobDetails = await this.client.getJobDetails(jobId);

    while (jobDetails.status !== 'transcribed') {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      jobDetails = await this.client.getJobDetails(jobId);
    }

    return await this.client.getTranscriptText(jobId);
  }
}
