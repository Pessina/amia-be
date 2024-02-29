import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessagesDto } from './dto/messages.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/completions')
  async getChatCompletions(@Body() messages: MessagesDto): Promise<string> {
    return this.chatService.chatCompletions(messages);
  }
}
