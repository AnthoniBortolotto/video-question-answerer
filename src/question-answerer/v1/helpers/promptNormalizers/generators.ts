import { ChatCompletionMessageParam } from 'openai/resources';

export function generateModerationMessages(
  question: string,
): ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content: `You are a back-end API service that checks if a string have harmful or hatred content, if it does not have, answer only 'yes', if it does, answer only 'no', you should answer only this 2 words`,
    },
    {
      role: 'user',
      content: `${question}`,
    },
  ];
}

export function generateQuestionAnswererMessages(
  transcription: string,
  question: string,
  lang: string,
): ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content: `You are a back-end API service that receives a Youtube video transcription in the language ${lang} and a question about the whole video, you should answer the question with the the transcription, names and slangs could have been written wrong in the transcription`,
    },
    { role: 'system', content: `Transcription: ${transcription}` },
    { role: 'user', content: `${question}` },
  ];
}
