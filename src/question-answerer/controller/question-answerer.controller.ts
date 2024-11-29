import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';

import { AnswerQuestionDto } from '../dtos/AnswerQuestion.dto';
import { AnswerQuestionWithTranscriptionDto } from '../dtos/answerQuestionWithTranscription.dto';
import { QuestionAnswererService } from '../service/question-answerer.service';

@Controller('/api/v1/answer-question')
export class QuestionAnswererController {
  constructor(
    private readonly questionAnswererService: QuestionAnswererService,
  ) {}

  @Get()
  async answerQuestion(@Query() query: AnswerQuestionDto) {
    return await this.questionAnswererService.sendResponse({
      question: query.question,
      videoId: query.videoId,
      lang: query.lang,
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
