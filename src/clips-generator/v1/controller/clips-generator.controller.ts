import { Controller, Get, Param, Query } from '@nestjs/common';
import { ClipsGeneratorService } from '../service/clips-generator.service';
import { GenerateClipsDto } from '../dtos/generate-clips.dto';

@Controller('/api/v1/clips-generator')
export class ClipsGeneratorController {
  constructor(private readonly clipsGeneratorService: ClipsGeneratorService) {}

  @Get(':videoId')
  async generateClips(
    @Param('videoId') videoId: string,
    @Query() generateClipsDto: GenerateClipsDto,
  ) {
    return this.clipsGeneratorService.generateClips(videoId, generateClipsDto);
  }
}
