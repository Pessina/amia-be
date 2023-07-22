import { Injectable } from '@nestjs/common';
import { ChatGptService } from './models/gpt.service';

type Models = 'gpt';

@Injectable()
export class LLMService {
  constructor(private gpt: ChatGptService) {}

  async processText(model: Models, text: string): Promise<string> {
    let resText = '';

    if (model === 'gpt') {
      resText = await this.gpt.createChatCompletion('gpt-3.5-turbo', text);
    }

    return resText;
  }
}
