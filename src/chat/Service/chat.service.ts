import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  generateChunkMessages,
  generateChunkPrompt,
  generateJoinChunkMessages,
} from 'src/helpers/promptNormalizers/generators';
import { splitPrompts } from 'src/helpers/promptNormalizers/normalizers';
import { useOpenAI } from 'src/services/openAI';
import { getTranscription } from 'src/services/transcriptor';

@Injectable()
export class ChatService {
  sendIntro(): string {
    return 'Welcome to the chat service!';
  }

  async sendResponse(
    question: string,
    videoId: string,
    lang = 'pt',
  ): Promise<{ message: any }> {
    const transcription = await getTranscription(videoId, lang);
    const transcriptionChunks = splitPrompts(transcription, 10000);
    const iaAnswers = new Array<string>();
    const transcriptionChunksPromisses = transcriptionChunks.map(
      async (chunk) => {
        const chunkMessage = generateChunkMessages(chunk, question, lang);
        const IAResponse = await useOpenAI({
          model: 'gpt-3.5-turbo-16k',
          messages: chunkMessage,
          temperature: 0.1,
        });

        iaAnswers.push(IAResponse.choices[0].message.content);

    /*    const IaMock = {
          role: 'assistant',
          content:
            'No vídeo, é relatado que o filho do Ministro Alexandre de Moraes foi agredido no aeroporto de Roma.',
        };
        iaAnswers.push(IaMock.content); */
      },
    );
    await Promise.all(transcriptionChunksPromisses).catch((err) => {
      console.log('Erro na junção de transcrições', err);
      throw new InternalServerErrorException('Error trying to join chunks');
    });
    const joinedMessages = generateJoinChunkMessages(iaAnswers, question, lang);
    const IAResponse = await useOpenAI({
      model: 'gpt-3.5-turbo-16k',
      messages: joinedMessages,
      temperature: 0.1,
    });
    return { message: IAResponse.choices[0].message.content };
  }
}
