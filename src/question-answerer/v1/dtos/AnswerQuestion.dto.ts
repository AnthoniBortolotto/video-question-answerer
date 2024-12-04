import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AnswerQuestionDto {
  @IsNotEmpty({ message: 'The question must not be empty', always: true })
  @IsString({
    message: 'The question must be a string',
    always: true,
  })
  question: string;
  @IsNotEmpty({ message: 'The video Id can not be empty', always: true })
  @IsString({ message: 'The video Id must be a string', always: true })
  videoId: string;

  @IsOptional()
  @IsString({ message: 'The language must be a string', always: true })
  lang?: string;
}
