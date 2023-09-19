import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QuestionAnswererService } from '../service/question-answerer.service';
import { QuestionAnswererController } from '../controller/question-answerer.controller';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  })],
  providers: [QuestionAnswererService],
  controllers: [QuestionAnswererController],
  exports: [QuestionAnswererService],
})
export class QuestionAnswererModule {}
