import { Injectable } from '@nestjs/common';
import { ChatCompletionResponse, ChatGptService, GPTSchema } from './models/gpt.service';

type Models = 'gpt';

export type LLMMessage = {
  role: 'user' | 'system' | 'assistant' | 'function';
  content: string;
};

@Injectable()
export class LLMService {
  constructor(private gpt: ChatGptService) {}

  async processText(
    model: Models,
    messages: LLMMessage[],
    responseSchema?: GPTSchema
  ): Promise<ChatCompletionResponse> {
    let resText: ChatCompletionResponse;

    if (model === 'gpt') {
      resText = await this.gpt.createChatCompletion('gpt-3.5-turbo-16k', messages, responseSchema);
    }

    return resText;
  }
}
