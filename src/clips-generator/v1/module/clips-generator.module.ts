import { Module } from '@nestjs/common';
import { OpenaiModule } from 'src/providers/openai/v1/module/openai.module';
import { VideoTranscriptorModule } from 'src/providers/video-transcriptor/v1/module/video-transcriptor.module';
import { ClipsGeneratorService } from '../service/clips-generator.service';
import { ClipsGeneratorController } from '../controller/clips-generator.controller';

@Module({
  imports: [VideoTranscriptorModule, OpenaiModule],
  providers: [ClipsGeneratorService],
  controllers: [ClipsGeneratorController],
  exports: [ClipsGeneratorService],
})
export class ClipsGeneratorModule {}
