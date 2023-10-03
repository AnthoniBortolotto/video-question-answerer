/**
 * Split prompt into chunks of a received amount of characters
 * @param prompt Prompt to be splitted
 * @param chunkLimit limit of characters per chunk
 * @returns splitted prompt
 */
export function splitPrompts(prompt: string, chunkLimit: number): string[] {
  const splitedPrompt = prompt.split('\n');
  let currentChunk = new Array<string>();
  let currentChunkSize = 0;


  const promptChunks = new Array<string>();
  splitedPrompt.map((chunk, i) => {
    if (currentChunkSize + chunk.length < chunkLimit) {
      currentChunk.push(chunk);
      currentChunkSize += chunk.length;
    } else {
      promptChunks.push(currentChunk.join(' '));
      currentChunk = new Array<string>();
      currentChunkSize = 0;
      currentChunk.push(chunk);
    }
  });
  promptChunks.push(currentChunk.join(' '));
  return promptChunks;
}

export function sanitizePrompt(prompt: string): string {
  const sanitizedPrompt = prompt.replace(/[ ]+/g, ' ');
  return sanitizedPrompt;
}
