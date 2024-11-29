import { BadRequestException, Injectable } from '@nestjs/common';
import IAnswerQuestionBody from '../interfaces/IAnswerQuestionBody.interface';
import { AxiosError } from 'axios';
import { OpenaiService } from 'src/providers/openai/v1/service/openai.service';
import { VideoTranscriptorService } from 'src/providers/video-transcriptor/v1/service/video-transcriptor.service';
import { generateModerationMessages, generateQuestionAnswererMessages } from '../helpers/promptNormalizers/generators';

@Injectable()
export class QuestionAnswererService {
  constructor(
    private readonly opeanAiService: OpenaiService,
    private readonly videoTranscriptorService: VideoTranscriptorService,
  ) {}

  async sendResponse({
    question,
    lang = 'pt',
    videoId,
    receivedTranscription,
  }: IAnswerQuestionBody): Promise<{ message: string }> {
    //transcription
    let transcription = receivedTranscription;

    if (!transcription) {
      transcription = await this.videoTranscriptorService.getTranscriptionText(videoId, lang).catch(
        (err: AxiosError) => {
          console.log('Erro na transcrição', err);
          throw new BadRequestException(
            'Erro tentando obter transcrição, verifique se o vídeo está disponível e se o idioma está correto',
          );
        },
      );
    }

    //moderation
    const moderationMessages = generateModerationMessages(question);
    const moderationResult = (
      await this.opeanAiService.getCompletion({
        messages: moderationMessages,
        temperature: 0.1,
        maxResponseLength: 1,
      })
    ).content;

    // denied by moderation case
    if (moderationResult.toLowerCase().trim().substring(0, 2) === 'no') {
      return {
        message:
          'Não é possível responder essa pergunta em razão dela ter conteúdo inapropriado',
      };
    }

    const IAResponse = await this.opeanAiService.getCompletion({
      messages: generateQuestionAnswererMessages(transcription, question, lang),
      temperature: 0.1,
    });
    return { message: IAResponse.content}; 
  }
}
