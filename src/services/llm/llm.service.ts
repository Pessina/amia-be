import { Injectable } from '@nestjs/common';
import { ChatGptService, GptPipelineResponse } from './models/gpt.service';
import { Prompt } from './prompts/prompts.types';

type Models = 'gpt';

export type LLMMessage = {
  role: 'user' | 'system' | 'assistant' | 'function';
  content: string;
};

@Injectable()
export class LLMService {
  constructor(private gpt: ChatGptService) {}

  async processText(model: Models, prompts: Prompt[]): Promise<GptPipelineResponse> {
    let resText: GptPipelineResponse;

    if (model === 'gpt') {
      resText = await this.gpt.runGPTPipeline(prompts);
    }

    return resText;
  }
}
