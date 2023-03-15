import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatController } from './chat/Controller/chat.controller';
import { ChatModule } from './chat/Module/chat.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }), ChatModule ],
  controllers: [AppController, ChatController],
  providers: [AppService],
})
export class AppModule {}
