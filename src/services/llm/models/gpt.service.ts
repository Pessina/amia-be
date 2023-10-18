import axios from 'axios';
import { Prompt, PromptSchema } from '../prompts/prompts.types';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as Sentry from '@sentry/node';

type ModelPricing = {
  input: number;
  output: number;
};

const openAIPrices: { [key: string]: ModelPricing } = {
  'gpt-3.5-turbo': {
    input: 0.0015, // /1k tokens
    output: 0.002, // /1k tokens
  },
  'gpt-3.5-turbo-16k': {
    input: 0.003, // /1k tokens
    output: 0.004, // /1k tokens
  },
  'gpt-4': {
    input: 0.03, // /1k tokens
    output: 0.06, // /1k tokens
  },
  'whisper-1': {
    input: 0.006, // /min
    output: 0,
  },
};

export type Message = {
  role: string;
  content: string;
};

export type GptResponse = {
  message: string;
  price: number;
};

export type GptPipelineResponse = {
  messages: string[];
  price: number;
};

export class ChatGptService {
  private baseURL =
    'https://nami-ai-gpt4.openai.azure.com/openai/deployments/gpt4/chat/completions?api-version=2023-08-01-preview';

  async gpt(modelName = 'gpt-4', messages: Message[], schema?: PromptSchema): Promise<GptResponse> {
    const headers = {
      'api-key': process.env.AZURE_OPEN_AI_GPT_API_KEY,
      'Content-Type': 'application/json',
    };

    const data = {
      model: modelName,
      temperature: 0,
      messages: messages,
      ...(schema ? { functions: [{ name: 'res', parameters: schema }] } : {}),
    };

    try {
      const response = await axios.post(this.baseURL, data, { headers });
      const messageContent = response.data.choices[0].message;

      let retMessage;
      if (schema) {
        retMessage = messageContent.function_call.arguments;
      } else {
        retMessage = messageContent.content;
      }

      const price =
        response.data.usage.prompt_tokens * (openAIPrices[modelName].input / 1000) +
        response.data.usage.completion_tokens * (openAIPrices[modelName].output / 1000);

      return { message: retMessage, price: price };
    } catch (error) {
      Sentry.captureException(new HttpException(error.message, HttpStatus.BAD_REQUEST));
    }
  }

  async runGPTPipeline(prompts: Prompt[]): Promise<GptPipelineResponse> {
    const responses: { [key: string]: string } = {};
    const result: string[] = [];
    let price = 0;

    for (const prompt of prompts) {
      let content = prompt.content;

      for (const id in responses) {
        content = content.replace('{' + id + '}', responses[id]);
      }

      const messages: Message[] = [{ role: prompt.role, content: content }];
      const schema = prompt.schema;

      const response = await this.gpt(prompt.model, messages, schema);

      responses[prompt.id] = response.message;
      result.push(response.message);
      price += response.price;
    }

    return { messages: result, price: price };
  }
}
