import { Injectable } from '@nestjs/common';
import { ChatGptService } from 'src/services/llm/gpt.service';
import { WhisperService } from 'src/services/stt/whisper.service';

@Injectable()
export class VisitService {
  constructor(private whisper: WhisperService, private gpt: ChatGptService) {}

  async processAudio(audio: Express.Multer.File): Promise<string> {
    const text = await this.whisper.convertAudioToText(audio);

    const buildPrompt = (text: string) => {
      return `I will provide you a text and I need you to summarize it and classify the emotion of it
      text: ${text}`;
    };

    const messages = [
      {
        role: 'user',
        content: buildPrompt(text),
      },
    ];

    const gptResponse = await this.gpt.createChatCompletion('gpt-3.5-turbo', messages);

    console.log({ gptResponse });

    return gptResponse;
  }
}
