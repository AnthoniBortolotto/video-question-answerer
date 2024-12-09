import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { QuestionAnswererModule } from './question-answerer/v1/module/question-answerer.module';
import { ClipsGeneratorModule } from './clips-generator/v1/module/clips-generator.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    QuestionAnswererModule,
    ClipsGeneratorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
