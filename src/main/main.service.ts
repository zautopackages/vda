import { Injectable } from '@nestjs/common';
import { ProcessImageResponse } from 'src/common/interfaces/interfaces';
import { MarkdownService } from 'src/markdown/markdown.service';
import { OcrService } from 'src/ocr/ocr.service';


@Injectable()
export class MainService{

    constructor(
        private readonly ocrService: OcrService,
        private readonly markdownService: MarkdownService
    ) {}
    
    /**
     * Processes an image buffer to extract OCR content and convert it to Markdown.
     * @param fileBuffer - The buffer of the file to be processed.
     * @returns An object containing the extracted OCR content and converted Markdown content.
     */
    async processImage(fileBuffer: Buffer): Promise<ProcessImageResponse> {
        const ocrContent = await this.ocrService.extractOcr(fileBuffer);
        const markdownContent =await this.markdownService.convertToMarkdown(fileBuffer,ocrContent.content);
        console.log(ocrContent,markdownContent);
        return { ocrContent, markdownContent };
    }
}
