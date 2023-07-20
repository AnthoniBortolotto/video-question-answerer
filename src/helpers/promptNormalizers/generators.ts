export function generatePrompt(receivedMessage: string, question: string) {
    return `Você receberá a transcrição de um vídeo no Youtube e deve responder perguntas e responder baseado no texto da transcrição, se a resposta não estiver na transcrição responda que  não é possível responder essa pergunta com base no vídeo
  Pergunta: ${question}.
  Transcrição: ${receivedMessage}`;
  }