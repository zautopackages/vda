import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { BedRockService } from './client/bed-rock.service';

@Module({
  controllers: [],
  providers: [LlmService,BedRockService],
  exports: [LlmService]
})
export class LlmModule {}
