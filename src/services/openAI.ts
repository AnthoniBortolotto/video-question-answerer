import { Configuration, CreateCompletionResponse, OpenAIApi } from 'openai';
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

export function generatePrompt(receivedMessage: string) {
  return `Você receberá a transcrição de um vídeo no Youtube e deve responder perguntas e responder baseado no texto da transcrição, se a resposta não estiver na transcrição responda que  não é possível responder essa pergunta com base no vídeo
Transcrição: ${receivedMessage}`;
}

export function generateQuestion(question: string, previousPrompt: string) {
  return `
${previousPrompt}
  Pergunta: ${question}`;
}

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
}: IUseOpenAIOptions): Promise<CreateCompletionResponse> {
  const completion = await openai.createCompletion({
    model: model,
    prompt: generatePrompt(prompt),
    temperature: temperature,
    max_tokens: maxResponseLength,
  });
  return completion.data;
}

export async function generateInputOutput(functionString: string) {
  const prompt = generatePrompt(functionString);
  const completion = await useOpenAI({
    prompt,
    temperature: 0.5,
    maxResponseLength: 1020,
  });
  const results = completion.choices.map((choice) => choice.text);
  return results;
}
