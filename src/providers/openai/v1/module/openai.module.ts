import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenaiService } from '../service/openai.service';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  })],
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class OpenaiModule {}
