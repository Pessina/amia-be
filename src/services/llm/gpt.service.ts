import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

interface Message {
  role: string; // 'system', 'user', or 'assistant'
  content: string;
}

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

  async createChatCompletion(model: string, messages: Array<Message>): Promise<string | null> {
    const headers = {
      Authorization: `Bearer ${process.env.OPEAN_AI_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const data = {
      model,
      messages,
    };

    try {
      const response: AxiosResponse<ChatCompletionResponse> = await axios.post(
        this.base_url,
        data,
        {
          headers,
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
