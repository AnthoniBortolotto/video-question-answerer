import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { QuestionAnswererModule } from './question-answerer/module/question-answerer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    QuestionAnswererModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
