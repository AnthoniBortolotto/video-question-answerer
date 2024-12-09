import { Controller, Get, Param, Query } from '@nestjs/common';
import { ClipsGeneratorService } from '../service/clips-generator.service';
import { GenerateClipsQueryDto } from '../dtos/generate-clips-query.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('/api/v1/clips-generator')
export class ClipsGeneratorController {
  constructor(private readonly clipsGeneratorService: ClipsGeneratorService) {}

  @Get(':videoId')
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
        clips: {
          type: 'string',
        },
      },
    },
    example: {
      message: 'Clips generated successfully',
      clips: `00:00:10 - 00:10:30 "Nome do clipe"; ...`,
    },
  })
  async generateClips(
    @Param('videoId') videoId: string,
    @Query() generateClipsDto: GenerateClipsQueryDto,
  ): Promise<{ message: string; clips: string }> {
    return this.clipsGeneratorService.generateClips(videoId, generateClipsDto);
  }
  @Get(':videoId/format/excel')
  async generateClipsExcel(@Param('videoId') videoId: string, @Query() generateClipsDto: GenerateClipsQueryDto) {
    return this.clipsGeneratorService.generateClipsExcel(videoId, generateClipsDto);
  }
}
