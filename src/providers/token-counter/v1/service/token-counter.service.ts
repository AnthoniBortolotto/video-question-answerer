import { Injectable } from '@nestjs/common';
import GPT4Tokenizer from 'gpt4-tokenizer';

@Injectable()
export class TokenCounterService {
  constructor() {}

  async verifyIfPromptFits(text: string, model: "gpt3" | "gpt4", maxTokens: number) {
    const tokenizer = new GPT4Tokenizer({ type: model }); // or 'codex'
   
    const estimatedTokenCount = tokenizer.estimateTokenCount(text); // 7
    return estimatedTokenCount <= maxTokens;
  }
}
