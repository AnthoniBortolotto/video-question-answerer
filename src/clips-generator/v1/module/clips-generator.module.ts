import { Module } from '@nestjs/common';
import { OpenaiModule } from 'src/providers/openai/v1/module/openai.module';
import { VideoTranscriptorModule } from 'src/providers/video-transcriptor/v1/module/video-transcriptor.module';
import { ClipsGeneratorService } from '../service/clips-generator.service';
import { ClipsGeneratorController } from '../controller/clips-generator.controller';
import { TokenCounterModule } from 'src/providers/token-counter/v1/module/token-counter.module';
import { ExcelFileGeneratorModule } from 'src/providers/excel-file-generator/v1/module/excel-file-generator.module';

@Module({
  imports: [VideoTranscriptorModule, OpenaiModule, TokenCounterModule, ExcelFileGeneratorModule],
  providers: [ClipsGeneratorService],
  controllers: [ClipsGeneratorController],
  exports: [ClipsGeneratorService],
})
export class ClipsGeneratorModule {}
