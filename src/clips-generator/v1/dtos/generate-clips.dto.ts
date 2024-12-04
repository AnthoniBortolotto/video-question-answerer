import {
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class GenerateClipsDto {
  @IsOptional()
  @IsString({ message: 'The language must be a string', always: true })
  lang?: string;

  @IsOptional()
  @IsNumberString(
    {
      no_symbols: true,
    },
    {
      message: 'The maximum number of clips must be an integer',
      always: true,
    },
  )
  maxClips?: string;
  @IsOptional()
  @IsNumberString(
    {
      no_symbols: true,
    },
    {
      message: 'The minimum number of clips must be an integer',
      always: true,
    },
  )
  minClips?: string;

  @IsOptional()
  @IsNumberString(
    {
      no_symbols: true,
    },
    {
      message: 'The maximum clip duration must be an integer',
      always: true,
    },
  )
  maxClipDuration?: string;
  @IsOptional()
  @IsNumberString({
      no_symbols: true,
  },{
    message: 'The minimum clip duration must be an integer',
    always: true,
  })
  minClipDuration?: string;

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
}
