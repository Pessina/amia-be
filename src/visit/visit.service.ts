import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/services/email/email.service';
import { LLMService } from 'src/services/llm/llm.service';
import { STTService } from 'src/services/stt/stt.service';

@Injectable()
export class VisitService {
  constructor(private stt: STTService, private llm: LLMService, private email: EmailService) {}

  async processAudio(audio: Express.Multer.File): Promise<string> {
    const text = await this.stt.processAudio('whisper', audio);

    const buildPrompt = (text: string) => {
      return `I will provide you a text and I need you to summarize it and classify the emotion of it
      text: ${text}`;
    };

    const messages = [
      {
        role: 'system' as const,
        content: buildPrompt(text),
      },
    ];

    const gptResponse = await this.llm.processText('gpt', messages);

    this.email.sendEmail('sendGrid', 'fs.pessina@gmail.com', gptResponse);

    return '';
  }
}
