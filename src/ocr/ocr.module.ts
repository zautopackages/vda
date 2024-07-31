import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { LlmModule } from 'src/llm/llm.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports:[LlmModule,CommonModule],
  providers: [OcrService],
  exports: [OcrService]
})
export class OcrModule {}
