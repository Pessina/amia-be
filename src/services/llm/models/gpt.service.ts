import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { patientVisitSummaryPrompt } from '../prompts/patientVisitSummary.prompt';

type ChatCompletionResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: { role: string; content: string };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

@Injectable()
export class ChatGptService {
  private readonly base_url = 'https://api.openai.com/v1/chat/completions';

  async createChatCompletion(model: string, text: string): Promise<string | null> {
    const headers = {
      Authorization: `Bearer ${process.env.OPEAN_AI_API_KEY}`,
      'Content-Type': 'application/json',
      temperature: 0,
    };

    const data = {
      model,
      messages: [
        {
          role: 'system' as const,
          content: patientVisitSummaryPrompt(text),
        },
      ],
    };

    const response = await axios.post<ChatCompletionResponse>(this.base_url, data, { headers });

    return response.data.choices[0].message.content;
  }
}
