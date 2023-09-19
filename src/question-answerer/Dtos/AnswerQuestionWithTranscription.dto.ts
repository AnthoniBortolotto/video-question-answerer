import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AnswerQuestionWithTranscriptionDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsString()
  transcription: string;

  @IsOptional()
  @IsString()
  lang?: string;

  constructor(question, transcription, lang) {
    this.question = question;
    this.transcription = transcription;
    this.lang = lang;
  }
}
