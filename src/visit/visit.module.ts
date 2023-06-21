import { Module } from '@nestjs/common';
import { VisitController } from './visit.controller';
import { SpeechmaticsService } from './services/speechmatics.service';
import { DeepgramService } from './services/deepgram.service';

@Module({
  controllers: [VisitController],
  providers: [SpeechmaticsService, DeepgramService],
})
export class VisitModule {}
