import { Body, Controller, Get, Post } from '@nestjs/common';
import IAnswerQuestionBody from '../interfaces/IAnswerQuestionBody.interface';
import { ChatService } from '../Service/chat.service';

@Controller('/api/v1/answer-question')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Get()
  receiveIntro(): string {
    return this.chatService.sendIntro();
  }

  @Post()
  async answerQuestion(@Body() body: IAnswerQuestionBody){
    return await this.chatService.sendResponse(body.question, body.videoId);
  }
}
