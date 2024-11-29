export function sanitizePrompt(prompt: string): string {
  const sanitizedPrompt = prompt.replace(/[ ]+/g, ' ');
  return sanitizedPrompt;
}
