import { Module } from '@nestjs/common';
import { ChatController } from './chat/Controller/chat.controller';
import { ChatModule } from './chat/Module/chat.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
