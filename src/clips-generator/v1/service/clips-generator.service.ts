import { Injectable } from '@nestjs/common';
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

  async generateClips(
    videoId: string,
    { lang = 'en', ...generateClipsDto }: GenerateClipsDto,
  ) {
    const rawTranscription =
      await this.videoTranscriptorService.getTranscriptionDialogues(
        videoId,
        lang,
      );
    const formattedTranscription = this.videoTranscriptorService
      .normalizeTranscriptionDialogues(
        rawTranscription,
        generateClipsDto.videoStart,
        generateClipsDto.videoEnd,
      )
      .join('; ');
    /*
    todo: 
    - error handling
    - excel file generation
    - token counter
    - validate max and min amount
    - validate time
    */
    const completion = await this.opeanAiService.getCompletion({
      temperature: 1,
      messages: generateClipsMessage(formattedTranscription, {
        lang,
        maxClips: Number(generateClipsDto.maxClips),
        minClips: Number(generateClipsDto.minClips),
        maxClipDuration: Number(generateClipsDto.maxClipDuration),
        minClipDuration: Number(generateClipsDto.minClipDuration),
      }),
    });

    const normalizedClipsText = normalizedClipsNames(completion.content);
    return {
      message: 'Clips generated successfully',
      clips: normalizedClipsText,
    };
  }
}
