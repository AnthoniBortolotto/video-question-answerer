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

  async getCompletion({
    messages,
    model = 'gpt-3.5-turbo-16k',
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
        throw new InternalServerErrorException('Error no acesso ao OpenAI');
      });
    return completion.data;
  }
}
