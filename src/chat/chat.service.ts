import { Injectable } from '@nestjs/common';
import { StackAIDoctorFlowInput, StackAIDoctorFlowOutput } from 'src/utils/stack-ai';
import StackAI from 'src/utils/stack-ai/stack-ai';
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

  stackAIRun(request: StackAIDoctorFlowInput): Promise<StackAIDoctorFlowOutput | undefined> {
    const stackAI = new StackAI<StackAIDoctorFlowInput, StackAIDoctorFlowOutput>({
      apiKey: process.env.STACK_AI_API_KEY,
      orgId: '08b4c5e1-1ba1-42b4-9770-63c9a047cf75',
      flowId: '65e457ac67f92accc582e4b9',
    });

    return stackAI.query(request);
  }
}
