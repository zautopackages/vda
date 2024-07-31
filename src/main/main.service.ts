import { Injectable } from '@nestjs/common';
import { MarkdownService } from 'src/markdown/markdown.service';
import { OcrService } from 'src/ocr/ocr.service';

@Injectable()
export class MainService {

    constructor(
        private readonly ocrService: OcrService,
        private readonly markdownService: MarkdownService
    ) { }
    

    async processImage(fileBuffer: Buffer) {
        const ocrContent = await this.ocrService.extractOcr(fileBuffer);
        const markdownContent = this.markdownService.convertToMarkdown(ocrContent);
        console.log(ocrContent,markdownContent);
        
    }
}
