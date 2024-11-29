import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QuestionAnswererService } from '../service/question-answerer.service';
import { QuestionAnswererController } from '../controller/question-answerer.controller';
import { VideoTranscriptorModule } from 'src/providers/video-transcriptor/v1/module/video-transcriptor.module';
import { OpenaiModule } from 'src/providers/openai/v1/module/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    VideoTranscriptorModule,
    OpenaiModule,
  ],
  providers: [QuestionAnswererService],
  controllers: [QuestionAnswererController],
  exports: [QuestionAnswererService],
})
export class QuestionAnswererModule {}