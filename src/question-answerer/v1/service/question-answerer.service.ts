import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import IAnswerQuestionBody from '../interfaces/IAnswerQuestionBody.interface';
import { AxiosError } from 'axios';
import { OpenaiService } from 'src/providers/openai/v1/service/openai.service';
import { VideoTranscriptorService } from 'src/providers/video-transcriptor/v1/service/video-transcriptor.service';
import { generateModerationMessages, generateQuestionAnswererMessages } from '../helpers/promptNormalizers/generators';

@Injectable()
export class QuestionAnswererService {
  constructor(
    private readonly opeanAiService: OpenaiService,
    private readonly videoTranscriptorService: VideoTranscriptorService,
  ) {}

  async sendResponse({
    question,
    lang = 'pt',
    videoId,
    receivedTranscription,
  }: IAnswerQuestionBody): Promise<{ message: string }> {
    try {
      //transcription
      let transcription = receivedTranscription;

      if (!transcription) {
        transcription = await this.videoTranscriptorService
          .getTranscriptionText(videoId, lang)
          .catch((err: AxiosError) => {
            Logger.error('Error getting transcription', err);
            throw new NotFoundException(
              'Transcription not found. Please check if the videoId and language are correct',
            );
          });
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
