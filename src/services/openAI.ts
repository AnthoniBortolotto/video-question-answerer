import { InternalServerErrorException } from '@nestjs/common';
import { AxiosError } from 'axios';
import {
  Configuration,
  CreateChatCompletionResponse,
  OpenAIApi,
  ChatCompletionRequestMessage,
} from 'openai';
import { ModelType } from '../question-answerer/helpers/types/AITypes';


interface IUseOpenAIOptions {
  messages: ChatCompletionRequestMessage[];
  temperature?: number;
  model?: ModelType;
  maxResponseLength?: number;
}
export default class OpenAI {
  openai: OpenAIApi;
  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPEN_AI_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async getModeration(question: string){
    const moderationResult = await this.openai.createModeration({
      model: 'text-moderation-stable',
      input: question,
    })
    return moderationResult.data.results;
  }

  async getCompletion({
    messages,
    model = 'text-davinci-003',
    temperature = 0.5,
    maxResponseLength = 1000,
  }: IUseOpenAIOptions): Promise<CreateChatCompletionResponse> {
    const completion = await this.openai
      .createChatCompletion({
        model: model,
        temperature: temperature,
        max_tokens: maxResponseLength,
        messages: messages,
      })
      .catch((err: AxiosError) => {
        console.log('erro do OpenAi', err?.response);
        throw new InternalServerErrorException('Error in useOpenAI');
      });
    // console.log('after request', completion.data.choices[0].message);
    return completion.data;
  }
}
