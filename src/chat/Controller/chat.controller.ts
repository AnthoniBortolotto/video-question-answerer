import { Body, Controller, Get, Post } from '@nestjs/common';
import IAnswerQuestionBody from '../interfaces/IAnswerQuestionBody.interface';
import { ChatService } from '../Service/chat.service';
import { AnswerQuestionDto } from '../Dtos/AnswerQuestion.dto';
import { AnswerQuestionWithTranscriptionDto } from '../Dtos/answerQuestionWithTranscription.dto';

@Controller('/api/v1/answer-question')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Get()
  receiveIntro(): string {
    return this.chatService.sendIntro();
  }

  @Post()
  async answerQuestion(@Body() body: AnswerQuestionDto) {
    return await this.chatService.sendResponse({
      question: body.question,
      videoId: body.videoId,
      lang: body.lang,
    });
  }
  @Post('/with-transcription')
  async answerQuestionWithTranscript(
    @Body() body: AnswerQuestionWithTranscriptionDto,
  ) {
    return await this.chatService.sendResponse({
      question: body.question,
      receivedTranscription: body.transcription,
      lang: body.lang,
    });
  }
}
