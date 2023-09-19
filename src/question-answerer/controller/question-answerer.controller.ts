import { Body, Controller, Get, Post } from '@nestjs/common';

import { AnswerQuestionDto } from '../dtos/AnswerQuestion.dto';
import { AnswerQuestionWithTranscriptionDto } from '../dtos/answerQuestionWithTranscription.dto';
import { QuestionAnswererService } from '../service/question-answerer.service';

@Controller('/api/v1/answer-question')
export class QuestionAnswererController {
  constructor(
    private readonly questionAnswererService: QuestionAnswererService,
  ) {}

  @Post()
  async answerQuestion(@Body() body: AnswerQuestionDto) {
    console.log('entrou',);
    return;
    return await this.questionAnswererService.sendResponse({
      question: body.question,
      videoId: body.videoId,
      lang: body.lang,
    });
  }
  @Post('/with-transcription')
  async answerQuestionWithTranscript(
    @Body() body: AnswerQuestionWithTranscriptionDto,
  ) {
    return await this.questionAnswererService.sendResponse({
      question: body.question,
      receivedTranscription: body.transcription,
      lang: body.lang,
    });
  }
}
