import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { GenerateClipsDto } from '../dtos/generate-clips.dto';
import { OpenaiService } from 'src/providers/openai/v1/service/openai.service';
import { VideoTranscriptorService } from 'src/providers/video-transcriptor/v1/service/video-transcriptor.service';
import { generateClipsMessage } from '../helpers/promptNormalizers/generate-clips-message';
import { normalizedClipsNames } from '../helpers/promptNormalizers/normalize-clips-names';
import { TokenCounterService } from 'src/providers/token-counter/v1/service/token-counter.service';
import { GPT4_MAX_TOKENS } from 'src/providers/token-counter/v1/helpers/constants/models-max-tokens.contant';

@Injectable()
export class ClipsGeneratorService {
  constructor(
    private readonly opeanAiService: OpenaiService,
    private readonly videoTranscriptorService: VideoTranscriptorService,
    private readonly tokenCounterService: TokenCounterService,
  ) {}

  async generateClips(videoId: string, generateClipsDto: GenerateClipsDto) {
    try {
    const rawTranscription = await this.videoTranscriptorService.getTranscriptionDialogues(
      videoId,
      generateClipsDto.lang,
    );

    const videoStartDate = generateClipsDto.videoStart && new Date(`1970-01-01Z${generateClipsDto.videoStart}`);
    const videoEndDate = generateClipsDto.videoEnd && new Date(`1970-01-01Z${generateClipsDto.videoEnd}`);

    const formattedTranscription = this.videoTranscriptorService
      .normalizeTranscriptionDialogues(rawTranscription, videoStartDate, videoEndDate)
      .join('; ');

      const transcriptionIsTooLong = await this.tokenCounterService.verifyIfPromptFits(
        formattedTranscription,
        'gpt4',
        GPT4_MAX_TOKENS,
      );

      if (!transcriptionIsTooLong) {
        throw new BadRequestException('The video transcription is too long, try to use the videoStart and videoEnd parameters, to reduce the transcription size');
      }

      const promptMessages = generateClipsMessage(formattedTranscription, generateClipsDto);
    /*
    todo: 
    - excel file generation
    - Swagger documentation
    */
   
    const completion = await this.opeanAiService.getCompletion({
      temperature: 1,
      messages: promptMessages
    });

    const normalizedClipsText = normalizedClipsNames(completion.content);
    return {
      message: 'Clips generated successfully',
      clips: normalizedClipsText,
    };
  } catch (error) {
    Logger.error('error on generateClips in ClipsGeneratorService', error);
    throw error;
  }
  }
}
