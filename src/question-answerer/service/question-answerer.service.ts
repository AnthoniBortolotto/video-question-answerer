import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  generateChunkMessages,
  generateJoinChunkMessages,
  generateModerationMessages,
} from '../helpers/promptNormalizers/generators';
import { splitPrompts } from '../helpers/promptNormalizers/normalizers';
import OpenAI from '../../services/openAI';
import { getTranscription } from '../../services/transcriptor';
import IAnswerQuestionBody from '../interfaces/IAnswerQuestionBody.interface';
import { AxiosError } from 'axios';

@Injectable()
export class QuestionAnswererService {
  async sendResponse({
    question,
    lang = 'pt',
    videoId,
    receivedTranscription,
  }: IAnswerQuestionBody): Promise<{ message: string }> {
    //transcription
    let transcription = receivedTranscription;
    if (!transcription) {
      transcription = await getTranscription(videoId, lang).catch(
        (err: AxiosError) => {
          console.log('Erro na transcrição', err);
          throw new InternalServerErrorException(
            'Erro tentando obter transcrição, verifique se o vídeo está disponível e se o idioma está correto',
          );
        },
      );
    }


    const iaAnswers = new Array<string>();
    const AI = new OpenAI();

    //moderation
    const moderationMessages = generateModerationMessages(question);
    const moderationResult = (
      await AI.getCompletion({
        messages: moderationMessages,
        temperature: 0.1,
        maxResponseLength: 1,
      })
    ).choices[0].message.content;



    // denied by moderation
    if (moderationResult.toLowerCase().trim().substring(0, 2) === 'no') {
      return {
        message:
          'Não é possível responder essa pergunta em razão dela ter conteúdo inapropriado',
      };
    }

    const transcriptionChunks = splitPrompts(transcription, 10000);

    // chunks treatment
    const transcriptionChunksPromisses = transcriptionChunks.map(
      async (chunk) => {
        const chunkMessage = generateChunkMessages(chunk, question, lang);
        const IAResponse = await AI.getCompletion({
          messages: chunkMessage,
          temperature: 0.1,
        });

        iaAnswers.push(IAResponse.choices[0].message.content);
      },
    );
    await Promise.all(transcriptionChunksPromisses).catch((err) => {
      console.log('Erro na junção de transcrições', err);
      throw new InternalServerErrorException('Erro na junção de transcrições');
    });

    //answer question
    const joinedMessages = generateJoinChunkMessages(iaAnswers, question, lang);
    const IAResponse = await AI.getCompletion({
      messages: joinedMessages,
      temperature: 0.1,
    });
    return { message: IAResponse.choices[0].message.content };
  }
}
