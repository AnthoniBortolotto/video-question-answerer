import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai';

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

export function generateChunkMessages(
  chunk: string,
  question: string,
  lang: string,
): ChatCompletionRequestMessage[] {
  return [
    {
      role: 'system',
      content: `You are a back-end API service that receives a chunk of a Youtube video transcription in the language ${lang} transcription and a question about the whole video, you should answer the question with the chunk you have (all relevant answers will be merged after) or answer 'ignore' if it is not possible to answer the question with this chunk`,
    },
    { role: 'system', content: `Transcription: ${chunk}` },
    { role: 'user', content: `${question}` },
  ];
}

export function generateModerationMessages(
  question: string,
): ChatCompletionRequestMessage[]{
    return[
      {
        role: 'system',
        content: `You are a back-end API service that checks if a string is appropriate, if it is, answer only 'yes', if it is not, answer only 'no', you should answer only this 2 words`,
      },
      {
        role: 'user',
        content: `${question}`,
      }
    ]
}

export function generateJoinChunkMessages(
  chunks: string[],
  question: string,
  lang: string,
): ChatCompletionRequestMessage[] {
  return [
    {
      role: 'system',
      content: `You are a back-end API service that receives answers from a GPT-3 model and joins them to form a single answer to a question about a Youtube video, you should answer the question using the answers from many chunks of the video transcription, irelevant chunks will return the answer 'ignore', if it is not possible to answer the question, answer a message saying that it is not possible to answer the question with the video transcription`,
    },
    ...chunks.map((chunk, i) => {
      return {
        role: 'system' as ChatCompletionRequestMessageRoleEnum,
        content: `Answer${i + 1}: ${chunk}`,
      };
    }),
    { role: 'user', content: `${question}` },
  ];
}
