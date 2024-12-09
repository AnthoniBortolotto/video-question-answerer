import { BadRequestException } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsNumberString, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import { IsTimeString } from '../validators/time-string.validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateClipsQueryDto {
  @IsOptional()
  @IsString({ message: 'The language must be a string', always: true })
  @ApiProperty({
    example: 'en-US',
    nullable: true,
    description: 'The language of the question in BCP 47 format, defaults to en',
  })
  lang?: string;

  @IsOptional()
  @IsInt({
    message: 'The maximum number of clips must be an integer',
    always: true,
  })
  @Max(10, { message: 'The maximum number of clips must be less than 10' })
  @Min(5, { message: 'The maximum number of clips must be greater than 1' })
  @Type(() => Number)
  maxClips?: number;
  @IsOptional()
  @IsInt({
    message: 'The minimum number of clips must be an integer',
    always: true,
  })
  @Max(5, { message: 'The minimum number of clips must be less than 10' })
  @Min(2, { message: 'The minimum number of clips must be greater than 1' })
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
  @ApiProperty({
    example: 10,
    nullable: true,
    description: 'The maximum clip duration in minutes',
  })
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
  @ApiProperty({
    example: 5,
    nullable: true,
    description: 'The minimum clip duration in minutes',
  })
  minClipDuration?: number;

  @IsOptional()
  @IsString({ message: 'The video start must be a string', always: true })
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'The video start must be in the format hh:mm:ss',
    always: true,
  })
  @IsTimeString({
    message: 'The video start must be a valid time format',
    always: true,
  })
  @ApiProperty({
    example: '00:30:00',
    nullable: true,
    description: 'The time of the video that the clip generator should start to generate clips',
  })
  videoStart?: string;

  @IsOptional()
  @IsString({ message: 'The video end must be a string', always: true })
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'The video end must be in the format hh:mm:ss',
    always: true,
  })
  @IsTimeString({
    message: 'The video end must be a valid time format',
    always: true,
  })
  @ApiProperty({
    example: '00:50:00',
    nullable: true,
    description: 'The time of the video that the clip generator should stop to generate clips',
  })
  videoEnd?: string;
}
