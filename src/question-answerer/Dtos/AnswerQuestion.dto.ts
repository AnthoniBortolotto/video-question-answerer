import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AnswerQuestionDto {
  @IsNotEmpty()
  @IsString()
  question: string;
  @IsNotEmpty()
  @IsString()
  videoId: string;

  @IsOptional()
  @IsString()
  lang?: string;

  constructor(question, videoId, lang) {
    this.question = question;
    this.videoId = videoId;
    this.lang = lang;
  }
}
