import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { LLMMessage } from '../llm.service';

type StringObject =
  | {
      [key: string]: StringObject | Array<StringObject> | string;
    }
  | (StringObject | Array<StringObject> | string)[];

export type GPTSchema = {
  type: 'object';
  properties: {
    [key: string]: StringObject;
  };
};

export type ChatCompletionResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
      function_call: {
        name: string;
        arguments: string;
      };
    };
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

  async createChatCompletion(
    model: string,
    messages: LLMMessage[],
    responseSchema?: GPTSchema
  ): Promise<ChatCompletionResponse> {
    const headers = {
      Authorization: `Bearer ${process.env.OPEAN_AI_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const data = {
      model,
      temperature: 0,
      messages: messages,
      ...(responseSchema ? { functions: [{ name: 'res', parameters: responseSchema }] } : {}),
    };

    const res = await axios.post<ChatCompletionResponse>(this.base_url, data, { headers });

    return res.data;
  }
}
