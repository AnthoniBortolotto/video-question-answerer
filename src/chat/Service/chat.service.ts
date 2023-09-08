import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  generateChunkMessages,
  generateChunkPrompt,
  generateJoinChunkMessages,
  generateModerationMessages,
} from 'src/helpers/promptNormalizers/generators';
import { splitPrompts } from 'src/helpers/promptNormalizers/normalizers';
import OpenAI from 'src/services/openAI';
import { getTranscription } from 'src/services/transcriptor';
import IAnswerQuestionBody from '../interfaces/IAnswerQuestionBody.interface';

@Injectable()
export class ChatService {
  sendIntro(): string {
    return 'Welcome to the chat service!';
  }

  async sendResponse(
    {
      question,
      lang = 'pt',
      videoId,
      receivedTranscription,
    }: IAnswerQuestionBody
  ): Promise<{ message: any }> {
    //transcription
    let transcription = receivedTranscription;
    if (!transcription) {
      transcription = await getTranscription(videoId, lang);
    }
    const transcriptionChunks = splitPrompts(transcription, 10000);

    const iaAnswers = new Array<string>();
    const AI = new OpenAI();

    //moderation
    const moderationMessages = generateModerationMessages(question);
    const moderationResult = (
      await AI.getCompletion({
        model: 'gpt-3.5-turbo',
        messages: moderationMessages,
        temperature: 0.1,
        maxResponseLength: 1,
      })
    ).choices[0].message.content;
   // console.log('Retorno da moderação', moderationResult);

    // denied by moderation
    if (moderationResult.toLowerCase().trim().substring(0, 2) === 'no') {
      return {
        message:
          'Não é possível responder essa pergunta em razão dela ter conteúdo inapropriado',
      };
    }

    // chunks treatment
    const transcriptionChunksPromisses = transcriptionChunks.map(
      async (chunk) => {
        const chunkMessage = generateChunkMessages(chunk, question, lang);
        const IAResponse = await AI.getCompletion({
          model: 'gpt-3.5-turbo-16k',
          messages: chunkMessage,
          temperature: 0.1,
        });

        iaAnswers.push(IAResponse.choices[0].message.content);
      },
    );
    await Promise.all(transcriptionChunksPromisses).catch((err) => {
      console.log('Erro na junção de transcrições', err);
      throw new InternalServerErrorException('Error trying to join chunks');
    });

    //answer question
    const joinedMessages = generateJoinChunkMessages(iaAnswers, question, lang);
    const IAResponse = await AI.getCompletion({
      model: 'gpt-3.5-turbo-16k',
      messages: joinedMessages,
      temperature: 0.1,
    });
    return { message: IAResponse.choices[0].message.content };
  }
}
