import { Module } from '@nestjs/common';
import { VisitController } from './visit.controller';
import { SpeechmaticsService } from '../services/stt/speechmatics.service';
import { DeepgramService } from '../services/stt/deepgram.service';
import { WhisperService } from '../services/stt/whisper.service';
import { RevAiService } from '../services/stt/rev.ai';
import { ChatGptService } from 'src/services/llm/gpt.service';
import { VisitService } from './visit.service';

@Module({
  controllers: [VisitController],
  providers: [
    SpeechmaticsService,
    DeepgramService,
    WhisperService,
    RevAiService,
    ChatGptService,
    VisitService,
  ],
})
export class VisitModule {}
