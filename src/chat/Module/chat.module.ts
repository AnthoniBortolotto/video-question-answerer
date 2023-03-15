import { Module } from '@nestjs/common';
import { ChatController } from '../Controller/chat.controller';
import { ChatService } from '../Service/chat.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  })],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
