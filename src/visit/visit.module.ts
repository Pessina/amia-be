import { Module } from '@nestjs/common';
import { VisitController } from './visit.controller';
import { SpeechmaticsService } from './services/speechmatics.service';
import { DeepgramService } from './services/deepgram.service';
import { WhisperService } from './services/whisper.service';

@Module({
  controllers: [VisitController],
  providers: [SpeechmaticsService, DeepgramService, WhisperService],
})
export class VisitModule {}
