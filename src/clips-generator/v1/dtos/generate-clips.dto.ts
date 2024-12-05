import { BadRequestException } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class GenerateClipsDto {
  @IsOptional()
  @IsString({ message: 'The language must be a string', always: true })
  lang: string;

  @IsOptional()
  @IsInt({
    message: 'The maximum number of clips must be an integer',
    always: true,
  })
  @Max(10, { message: 'The maximum number of clips must be less than 10' })
  @Min(1, { message: 'The maximum number of clips must be greater than 1' })
  @Type(() => Number)
  maxClips?: number;
  @IsOptional()
  @IsInt({
    message: 'The minimum number of clips must be an integer',
    always: true,
  })
  @Max(10, { message: 'The minimum number of clips must be less than 10' })
  @Min(1, { message: 'The minimum number of clips must be greater than 1' })
  @Type(() => Number)
  minClips?: number;

  @IsOptional()
  @IsInt({
    message: 'The maximum clip duration must be an integer',
    always: true,
  })
  @Min(2, {
    message: 'The maximum clip duration must be greater than 2 minutes',
  })
  @Max(45, {
    message: 'The maximum clip duration must be less than 45 minutes',
  })
  @Type(() => Number)
  maxClipDuration?: number;
  @IsOptional()
  @IsInt({
    message: 'The minimum clip duration must be an integer',
    always: true,
  })
  @Min(1, {
    message: 'The minimum clip duration must be greater than 1 minute',
  })
  @Max(40, {
    message: 'The minimum clip duration must be less than 40 minutes',
  })
  @Type(() => Number)
  minClipDuration?: number;

  @IsOptional()
  @IsString({ message: 'The video start must be a string', always: true })
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'The video start must be in the format hh:mm:ss',
    always: true,
  })
  videoStart?: string;
  @IsOptional()
  @IsString({ message: 'The video end must be a string', always: true })
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'The video end must be in the format hh:mm:ss',
    always: true,
  })
  videoEnd?: string;
  constructor(
    lang: string,
    maxClips: number,
    minClips: number,
    maxClipDuration: number,
    minClipDuration: number,
    videoStart: string,
    videoEnd: string,
  ) {
    this.lang = lang || 'en';
    if (maxClips < minClips) {
      throw new BadRequestException(
        'The maximum number of clips must be greater than the minimum number of clips',
      );
    }
    this.maxClips = maxClips;
    this.minClips = minClips;
    if (maxClipDuration < minClipDuration) {
      throw new BadRequestException(
        'The maximum clip duration must be greater than the minimum clip duration',
      );
    }
    this.maxClipDuration = maxClipDuration;
    this.minClipDuration = minClipDuration;
    const videoStartDate = videoStart && new Date(`1970-01-01Z${videoStart}`);
    const videoEndDate = videoEnd && new Date(`1970-01-01Z${videoEnd}`);

    if (videoStartDate?.toString() === 'Invalid Date')
      throw new BadRequestException(
        'Video start is not in a valid time format',
      );

    if (videoEndDate?.toString() === 'Invalid Date')
      throw new BadRequestException('Video end is not in a valid time format');

    this.videoStart = videoStart;
    this.videoEnd = videoEnd;
  }
}
