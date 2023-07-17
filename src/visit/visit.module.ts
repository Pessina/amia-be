import { Module } from '@nestjs/common';
import { VisitController } from './visit.controller';
import { VisitService } from './visit.service';
import { EmailService } from 'src/services/email/email.service';
import { LLMService } from 'src/services/llm/llm.service';
import { STTService } from 'src/services/stt/stt.service';
import { SendGridService } from 'src/services/email/providers/sendgrid.service';
import { ChatGptService } from 'src/services/llm/models/gpt.service';
import { WhisperService } from 'src/services/stt/models/whisper.service';
import { SpeechmaticsService } from 'src/services/stt/models/speechmatics.service';
import { DeepgramService } from 'src/services/stt/models/deepgram.service';
import { RevAiService } from 'src/services/stt/models/rev.ai';
import { AWSSESService } from 'src/services/email/providers/awsses.service';

@Module({
  controllers: [VisitController],
  providers: [
    VisitService,
    EmailService,
    LLMService,
    STTService,
    SendGridService,
    ChatGptService,
    WhisperService,
    SpeechmaticsService,
    DeepgramService,
    RevAiService,
    AWSSESService,
  ],
})
export class VisitModule {}
