import { Controller, Get, Param, Query } from '@nestjs/common';
import { ClipsGeneratorService } from '../service/clips-generator.service';
import { GenerateClipsQueryDto } from '../dtos/generate-clips-query.dto';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiResponse } from '@nestjs/swagger';

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
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
    },
    example: {
      message:
        'The video transcription is too long, try to use the videoStart and videoEnd parameters, to reduce the transcription size',
    },
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
    },
    example: {
      message: 'Internal server error',
    },
  })
  async generateClips(
    @Param('videoId') videoId: string,
    @Query() generateClipsDto: GenerateClipsQueryDto,
  ): Promise<{ message: string; clips: string }> {
    return this.clipsGeneratorService.generateClips(videoId, generateClipsDto);
  }
  @Get(':videoId/format/excel')
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
        file: {
          type: 'string',
        },
      },
    },
    example: {
      message: 'Clips generated successfully',
      file: 'Buffer',
    },
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
    },
    example: {
      message:
        'The video transcription is too long, try to use the videoStart and videoEnd parameters, to reduce the transcription size',
    },
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
    },
    example: {
      message: 'Internal server error',
    },
  })
  async generateClipsExcel(
    @Param('videoId') videoId: string,
    @Query() generateClipsDto: GenerateClipsQueryDto,
  ): Promise<{ message: string; file: Buffer }> {
    return this.clipsGeneratorService.generateClipsExcel(videoId, generateClipsDto);
  }
}
