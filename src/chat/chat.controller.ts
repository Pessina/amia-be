import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { InteractRequest, InteractResponse } from 'src/utils/voice-flow';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/interact')
  interact(
    @Body('request') request: InteractRequest,
    @Body('userId') userId: string,
  ): Promise<InteractResponse[]> {
    return this.chatService.interact(userId, request);
  }
}
