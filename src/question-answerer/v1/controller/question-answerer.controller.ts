import { Body, Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { AnswerQuestionWithTranscriptionBodyDto } from '../dtos/answer-question-with-transcription-body.dto';
import { QuestionAnswererService } from '../service/question-answerer.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AnswerQuestionQueryDto } from '../dtos/answer-question-query.dto';

@Controller('/api/v1/answer-question')
export class QuestionAnswererController {
  constructor(private readonly questionAnswererService: QuestionAnswererService) {}

  @Get('/:videoId')
  @ApiResponse({
    status: 200,
    description: 'The question was answered successfully',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
            },
          },
        },
      },
    },
    examples: {
      Q1: {
        summary: 'The question answered successfully',
        value: {
          message: 'The answer to the question is "The answer"',
        },
      },
      Q2: {
        summary: 'The question was denied by moderation',
        value: {
          message: 'This question was denied by moderation and cannot be answered due to its inappropriate content.',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error processing the question answer, possibly due to an internal error or a integration problem',
  })
  @ApiBadRequestResponse({
    description: 'The question is empty or the videoId is empty, please check the request and try again',
  })
  @ApiNotFoundResponse({
    description: 'The transcription was not found, please check if the videoId and language are correct',
  })
  @ApiParam({
    name: 'videoId',
    type: 'string',
    description: 'The videoId of the video in Youtube',
  })
  async answerQuestion(@Param('videoId') videoId, @Query() query: AnswerQuestionQueryDto): Promise<{ message: string }> {
    return await this.questionAnswererService.sendResponse({
      question: query.question,
      videoId: videoId,
      lang: query.lang,
    });
  }
  @Post('/with-transcription')
  @ApiResponse({
    status: 200,
    description: 'The question was answered successfully',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
            },
          },
        },
      },
    },
    //add example including the question and the answer and a question that was denied by moderation

    examples: {
      Q1: {
        summary: 'The question answered successfully',
        value: {
          message: 'The answer to the question is "The answer"',
        },
      },
      Q2: {
        summary: 'The question was denied by moderation',
        value: {
          message: 'This question was denied by moderation and cannot be answered due to its inappropriate content.',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'The question is empty or the videoId is empty, please check the request and try again',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error processing the question answer, possibly due to an internal error or a integration problem',
  })
  @HttpCode(200)
  @ApiBody({
    type: AnswerQuestionWithTranscriptionBodyDto,
    examples: {
      Q1: {
        summary: 'The question answered successfully',
        value: {
          question: 'What is the capital of France?',
          transcription: 'Paris is the capital of France',

        },
      },
      Q2: {
        summary: 'The question was denied by moderation',
        value: {
          question: '*****************',
          transcription: 'Paris is the capital of France',
          lang: 'en-US',
        },
      },
    }
  })
  async answerQuestionWithTranscript(@Body() body: AnswerQuestionWithTranscriptionBodyDto) {
    return await this.questionAnswererService.sendResponse({
      question: body.question,
      receivedTranscription: body.transcription,
      lang: body.lang,
    });
  }
}
