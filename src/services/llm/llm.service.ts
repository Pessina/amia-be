import { HttpStatus, Injectable } from '@nestjs/common';
import { ChatGptService } from './models/gpt.service';
import { AppException } from 'src/filters/exceptions/AppException';

type Models = 'gpt';

@Injectable()
export class LLMService {
  constructor(private gpt: ChatGptService) {}

  async processText(model: Models, text: string): Promise<string> {
    let resText = '';

    try {
      if (model === 'gpt') {
        resText = await this.gpt.createChatCompletion('gpt-3.5-turbo', text);
      }
    } catch (error) {
      console.error(`Failed to process text with LLM: ${error}`);
      throw new AppException(
        {
          code: 'LLM_PROCESSING_FAILED',
          meta: { target: ['LLM'] },
          message: 'Failed to process text with LLM',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    return resText;
  }
}
