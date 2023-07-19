import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/services/email/email.service';
import { LLMService } from 'src/services/llm/llm.service';
import { STTService } from 'src/services/stt/stt.service';

@Injectable()
export class VisitService {
  constructor(private stt: STTService, private llm: LLMService, private email: EmailService) {}

  async processAudio(email: string, audio: Express.Multer.File): Promise<string> {
    console.log(`Processing audio file of size: ${audio.size} bytes`);

    const text = await this.stt.processAudio('whisper', audio);
    const gptResponse = await this.llm.processText('gpt', text);
    await this.email.sendEmail('aws', email, `${text}\n\n\n\n${gptResponse}`);

    return `${text}\n\n\n\n${gptResponse}`;
  }
}
