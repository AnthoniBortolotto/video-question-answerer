import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VideoTranscriptorService } from '../service/video-transcriptor.service';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  })],
  providers: [VideoTranscriptorService],
  exports: [VideoTranscriptorService],
})
export class VideoTranscriptorModule {}
