import { ChatCompletionMessageParam } from 'openai/resources';

export function generatePrompt(receivedMessage: string, question: string) {
  return `Você receberá a transcrição de um vídeo no Youtube e deve responder perguntas e responder baseado no texto da transcrição, se a resposta não estiver na transcrição responda que  não é possível responder essa pergunta com base no vídeo
  Pergunta: ${question}.
  Transcrição: ${receivedMessage}`;
}

export function generateChunkPrompt(chunk: string, question: string) {
  return `
    Você receberá um de diversos fragmentos de transcrição de um vídeo no Youtube e uma pergunta, você deve responder a pergunta com o conteúdo deste fragmento, se a resposta não estiver no fragmento responda apenas 'ignorar'
    Pergunta: ${question}.
    Transcrição: ${chunk}
    Resposta:
    `;
}

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
