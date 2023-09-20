import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';

import { AnswerQuestionDto } from '../dtos/AnswerQuestion.dto';
import { AnswerQuestionWithTranscriptionDto } from '../dtos/answerQuestionWithTranscription.dto';
import { QuestionAnswererService } from '../service/question-answerer.service';

@Controller('/api/v1/answer-question')
export class QuestionAnswererController {
  constructor(
    private readonly questionAnswererService: QuestionAnswererService,
  ) {}

  @Post()
  @HttpCode(200)
  async answerQuestion(@Body() body: AnswerQuestionDto) {
    return await this.questionAnswererService.sendResponse({
      question: body.question,
      videoId: body.videoId,
      lang: body.lang,
    });
  }
  @Post('/with-transcription')
  @HttpCode(200)
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
