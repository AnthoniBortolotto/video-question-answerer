import { Injectable } from '@nestjs/common';
import { splitPrompts } from 'src/helpers/promptNormalizers/normalizers';
import {
  useOpenAI,
} from 'src/services/openAI';
import { getTranscription } from 'src/services/transcriptor';

@Injectable()
export class ChatService {
  sendIntro(): string {
    return 'Welcome to the chat service!';
  }

  async sendResponse(
    message: string,
    videoId: string,
  ): Promise<{ message: any }> {
    const transcription = await getTranscription(videoId);
    const transcriptionChunks = splitPrompts(transcription, 3000);
    //const transcriptionPrompt = generatePrompt(transcription, message);
    transcriptionChunks.map(async (chunk) => {

    })
    // const IAResponse = await useOpenAI({
    //   prompt: transcriptionPrompt,
    // });
    return { message: transcriptionChunks };
  }
}
