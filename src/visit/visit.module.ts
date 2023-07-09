import { Module } from '@nestjs/common';
import { VisitController } from './visit.controller';
import { SpeechmaticsService } from '../services/stt/models/speechmatics.service';
import { DeepgramService } from '../services/stt/models/deepgram.service';
import { WhisperService } from '../services/stt/models/whisper.service';
import { RevAiService } from '../services/stt/models/rev.ai';
import { ChatGptService } from 'src/services/llm/models/gpt.service';
import { VisitService } from './visit.service';
import { EmailService } from 'src/services/email/email.service';

@Module({
  controllers: [VisitController],
  providers: [
    SpeechmaticsService,
    DeepgramService,
    WhisperService,
    RevAiService,
    ChatGptService,
    VisitService,
    EmailService,
  ],
})
export class VisitModule {}
