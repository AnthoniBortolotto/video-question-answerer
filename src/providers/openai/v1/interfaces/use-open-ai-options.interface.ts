import { ChatCompletionMessageParam, ChatModel } from "openai/resources";

export interface IUseOpenAIOptions {
    messages: ChatCompletionMessageParam[];
    temperature?: number;
    model?: ChatModel;
    maxResponseLength?: number;
  }