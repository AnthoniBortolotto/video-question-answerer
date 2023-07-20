import { Configuration, CreateCompletionResponse, OpenAIApi } from 'openai';
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);



interface IUseOpenAIOptions {
  prompt: string;
  temperature?: number;
  model?: string;
  maxResponseLength?: number;
}

export async function useOpenAI({
  prompt,
  model = 'text-davinci-003',
  temperature = 0.5,
  maxResponseLength = 1000,
}: IUseOpenAIOptions): Promise<CreateCompletionResponse>{
  const completion = await openai.createCompletion({
    model: model,
    prompt: prompt,
    temperature: temperature,
    max_tokens: maxResponseLength,
  });
  return completion.data;
}

export async function generateInputOutput(functionString: string) {
  const prompt = functionString;
  const completion = await useOpenAI({
    prompt,
    temperature: 0.5,
    maxResponseLength: 1020,
  });
  const results = completion.choices.map((choice) => choice.text);
  return results;
}
