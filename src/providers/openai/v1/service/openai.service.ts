import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import OpenAI, { ClientOptions } from 'openai';
import { IUseOpenAIOptions } from '../interfaces/use-open-ai-options.interface';
import { ChatCompletionMessage } from 'openai/resources';



@Injectable()
export class OpenaiService {
  createConnection(): OpenAI {
    const configuration: ClientOptions = {
        apiKey: process.env.OPEN_AI_KEY,
    } 
    return new OpenAI(configuration);
  }

  async getCompletion({
    messages,
    model = 'gpt-4o-mini',
    temperature = 0.5,
  }: IUseOpenAIOptions): Promise<ChatCompletionMessage> {
    const openai = this.createConnection();

    const completion = await openai
      .chat.completions.create({
        model: model,
        messages: messages,
        temperature: temperature,
      })
      .catch((err: AxiosError) => {
        Logger.error('error on OpenAI getCompletion', err, err?.response?.data);
        throw new InternalServerErrorException('Error on accessing OpenAI service');
      });
    return completion.choices[0].message;
  }
}
