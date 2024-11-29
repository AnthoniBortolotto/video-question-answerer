import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AnswerQuestionWithTranscriptionDto {
  @IsNotEmpty({
    message: 'A pergunta não pode ser vazia',
    always: true,
  })
  @IsString({
    message: 'A pergunta deve ser uma string',
    always: true,
  })
  question: string;

  @IsNotEmpty({
    message: 'A transcrição não pode ser vazia',
    always: true,
  })
  @IsString({
    message: 'A transcrição deve ser uma string',
    always: true,
  })
  transcription: string;

  @IsOptional()
  @IsString({
    message: 'O idioma deve ser uma string',
    always: true,
  })
  lang?: string;

  constructor(question, transcription, lang) {
    this.question = question;
    this.transcription = transcription;
    this.lang = lang;
  }
}
