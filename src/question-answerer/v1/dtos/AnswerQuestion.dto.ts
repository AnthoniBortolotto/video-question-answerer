import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AnswerQuestionDto {
  @IsNotEmpty({ message: 'A pergunta não pode ser vazia', always: true })
  @IsString({
    message: 'A pergunta deve ser uma string',
    always: true,
  })
  question: string;
  @IsNotEmpty({ message: 'O id do vídeo não pode ser vazio', always: true })
  @IsString({ message: 'O id do vídeo deve ser uma string', always: true })
  videoId: string;

  @IsOptional()
  @IsString({ message: 'O idioma deve ser uma string', always: true })
  lang?: string;
}
