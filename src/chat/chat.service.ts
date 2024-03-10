import { Injectable } from '@nestjs/common';
import VoiceFlow, { InteractRequest, InteractResponse } from 'src/utils/voice-flow';

@Injectable()
export class ChatService {
  voiceFlowInteract(
    userId: string,
    request: InteractRequest,
  ): Promise<InteractResponse[] | undefined> {
    const voiceFlow = new VoiceFlow({ apiKey: process.env.VOICE_FLOW_API_KEY });

    return voiceFlow.interact(userId, request);
  }
}
