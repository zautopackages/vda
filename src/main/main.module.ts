import { Module } from '@nestjs/common';
import { MainService } from './main.service';
import { MainController } from './main.controller';
import { OcrModule } from 'src/ocr/ocr.module';
import { MarkdownModule } from 'src/markdown/markdown.module';

@Module({
  imports: [OcrModule,MarkdownModule],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService],
})
export class MainModule {}
