import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { MessagesDto } from './dto/messages.dto';

@Injectable()
export class ChatService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPEN_AI_API_KEY,
    });
  }

  async chatCompletions({ messages }: MessagesDto): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      const messagesResponse = response.choices[0].message.content;

      return messagesResponse;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw new Error('Failed to call OpenAI service');
    }
  }
}
