import { InternalServerErrorException } from '@nestjs/common';
import { AxiosError } from 'axios';
import {
  Configuration,
  CreateChatCompletionResponse,
  OpenAIApi,
  ErrorResponse,
  ChatCompletionRequestMessage,
} from 'openai';
import { ModelType } from 'src/helpers/types/AITypes';

interface IUseOpenAIOptions {
  messages: ChatCompletionRequestMessage[];
  temperature?: number;
  model?: ModelType;
  maxResponseLength?: number;
}

export async function useOpenAI({
  messages,
  model = 'text-davinci-003',
  temperature = 0.5,
  maxResponseLength = 1000,
}: IUseOpenAIOptions): Promise<CreateChatCompletionResponse> {
  const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const completion = await openai
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
