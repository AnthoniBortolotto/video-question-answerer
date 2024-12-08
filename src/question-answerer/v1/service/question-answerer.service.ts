import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import IAnswerQuestionBody from '../interfaces/IAnswerQuestionBody.interface';
import { OpenaiService } from 'src/providers/openai/v1/service/openai.service';
import { VideoTranscriptorService } from 'src/providers/video-transcriptor/v1/service/video-transcriptor.service';
import { generateModerationMessages, generateQuestionAnswererMessages } from '../helpers/promptNormalizers/generators';
import { TokenCounterService } from 'src/providers/token-counter/v1/service/token-counter.service';
import { GPT4_MAX_TOKENS } from 'src/providers/token-counter/v1/helpers/constants/models-max-tokens.contant';

@Injectable()
export class QuestionAnswererService {
  constructor(
    private readonly opeanAiService: OpenaiService,
    private readonly videoTranscriptorService: VideoTranscriptorService,
    private readonly tokenCounterService: TokenCounterService,
  ) {}

  async sendResponse({
    question,
    lang = 'en',
    videoId,
    receivedTranscription,
  }: IAnswerQuestionBody): Promise<{ message: string }> {
    try {
      //transcription
      let transcription = receivedTranscription;

      if (!transcription) {
        transcription = await this.videoTranscriptorService.getTranscriptionText(videoId, lang);
      }

      //moderation
      const moderationMessages = generateModerationMessages(question);
      const moderationResult = (
        await this.opeanAiService.getCompletion({
          messages: moderationMessages,
          temperature: 0.1,
          maxResponseLength: 1,
        })
      ).content;

      // denied by moderation case
      if (moderationResult.toLowerCase().trim().substring(0, 2) === 'no') {
        return {
          message: 'This question was denied by moderation and cannot be answered due to its inappropriate content.',
        };
      }
      const transcriptionIsTooLong = await this.tokenCounterService.verifyIfPromptFits(
        transcription,
        'gpt4',
        GPT4_MAX_TOKENS,
      );

      if (!transcriptionIsTooLong) {
        throw new BadRequestException(
          'The video transcription is too long, try to use the videoStart and videoEnd parameters, to reduce the transcription size',
        );
      }
      const IAResponse = await this.opeanAiService.getCompletion({
        messages: generateQuestionAnswererMessages(transcription, question, lang),
        temperature: 0.1,
      });
      return { message: IAResponse.content };
    } catch (error) {
      Logger.error('Error on QuestionAnswererService sendResponse ', error);
      throw error;
    }
  }
}
