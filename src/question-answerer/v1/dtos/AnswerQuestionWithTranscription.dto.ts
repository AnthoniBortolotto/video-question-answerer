import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AnswerQuestionWithTranscriptionDto {
  @IsNotEmpty({ message: 'The question must not be empty', always: true })
  @IsString({
    message: 'The question must be a string',
    always: true,
  })
  question: string;

  @IsNotEmpty({
    message: 'The transcription must not be empty',
    always: true,
  })
  @IsString({
    message: 'The transcription must be a string',
    always: true,
  })
  transcription: string;

  @IsOptional()
  @IsString({
    message: 'The language must be a string',
    always: true,
  })
  lang?: string;
}
