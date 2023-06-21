import { Module } from '@nestjs/common';
import { VisitController } from './visit.controller';
import { SpeechmaticsService } from './services/speechmatics.service';

@Module({
  controllers: [VisitController],
  providers: [SpeechmaticsService],
})
export class VisitModule {}
