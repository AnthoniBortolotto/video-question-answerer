import { Injectable, Logger } from '@nestjs/common';
import { GenerateClipsDto } from '../dtos/generate-clips.dto';
import { OpenaiService } from 'src/providers/openai/v1/service/openai.service';
import { VideoTranscriptorService } from 'src/providers/video-transcriptor/v1/service/video-transcriptor.service';
import { generateClipsMessage } from '../helpers/promptNormalizers/generate-clips-message';
import { normalizedClipsNames } from '../helpers/promptNormalizers/normalize-clips-names';

@Injectable()
export class ClipsGeneratorService {
  constructor(
    private readonly opeanAiService: OpenaiService,
    private readonly videoTranscriptorService: VideoTranscriptorService,
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
    /*
    todo: 
    - excel file generation
    - token counter
    */
    const completion = await this.opeanAiService.getCompletion({
      temperature: 1,
      messages: generateClipsMessage(formattedTranscription, generateClipsDto),
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
