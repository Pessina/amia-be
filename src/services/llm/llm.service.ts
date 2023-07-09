import { Injectable } from '@nestjs/common';
import { ChatGptService } from './models/gpt.service';

type Models = 'gpt';

type Message = {
  role: 'system' | 'patient' | 'doctor';
  content: string;
};

@Injectable()
export class LLMService {
  constructor(private gpt: ChatGptService) {}

  async processText(model: Models, messages: Message[]): Promise<string> {
    let resText = '';

    if (model === 'gpt') {
      resText = await this.gpt.createChatCompletion('gpt-3.5-turbo', messages);
    }

    return resText;
  }
}
