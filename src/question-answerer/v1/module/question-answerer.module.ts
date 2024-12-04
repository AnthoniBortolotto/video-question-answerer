import { Module } from '@nestjs/common';
import { QuestionAnswererService } from '../service/question-answerer.service';
import { QuestionAnswererController } from '../controller/question-answerer.controller';
import { VideoTranscriptorModule } from 'src/providers/video-transcriptor/v1/module/video-transcriptor.module';
import { OpenaiModule } from 'src/providers/openai/v1/module/openai.module';

@Module({
  imports: [VideoTranscriptorModule, OpenaiModule],
  providers: [QuestionAnswererService],
  controllers: [QuestionAnswererController],
  exports: [QuestionAnswererService],
})
export class QuestionAnswererModule {}
