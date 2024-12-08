import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AnswerQuestionQueryDto {
  @IsNotEmpty({ message: 'The question must not be empty', always: true })
  @IsString({
    message: 'The question must be a string',
    always: true,
  })
  @ApiProperty({
    example: 'Who is being interviewed in this video?',
    description: 'The question to be answered from the video',
  })
  question: string;

  @IsOptional()
  @IsString({ message: 'The language must be a string', always: true })
  @ApiProperty({
    example: 'en-US',
    nullable: true,
    description: 'The language of the question in BCP 47 format, defaults to en',
  })
  lang?: string;
}
