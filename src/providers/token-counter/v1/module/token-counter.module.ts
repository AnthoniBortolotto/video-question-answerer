import { Module } from '@nestjs/common';
import { TokenCounterService } from '../service/token-counter.service';

@Module({
  providers: [TokenCounterService],

  exports: [TokenCounterService],
})
export class TokenCounterModule {}
