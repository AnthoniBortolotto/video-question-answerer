import { Injectable } from '@nestjs/common';
import {
  generatePrompt,
  generateQuestion,
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
  ): Promise<{ message: string }> {
    const transcription = await getTranscription(videoId);
    const transcriptionPrompt = generatePrompt(transcription);
    const generatedPromptWithQuestion = generateQuestion(
      message,
      transcriptionPrompt,
    );

    const IAResponse = await useOpenAI({
      prompt: generatedPromptWithQuestion,
    });
    return { message: IAResponse.choices[0].text };
  }
}
