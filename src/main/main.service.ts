import { Injectable } from '@nestjs/common';
import { ProcessImageResponse } from 'src/common/interfaces/interfaces';
import { LlmResponse } from 'src/llm/llm.interfaces';
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
        try{
            const ocrContent = await this.ocrService.extractOcr(fileBuffer);
            if(!ocrContent) throw new Error('No OCR content found')
            const markdownContent =await this.markdownService.convertToMarkdown(fileBuffer,ocrContent.content);
            if(!markdownContent) throw new Error('No Markdown content found')
            return { ocrContent, markdownContent };
        } catch (error) {
            console.error('Error processing image:', error);
            throw error;
        }
    }

    /**
     * Extracts OCR content from a file buffer.
     * @remarks This method is used to extract OCR content from a file buffer.
     * @param fileBuffer - The buffer of the file to be processed.
     * @returns An object containing the extracted OCR content.
     */
    async extractOcrFromImage(fileBuffer: Buffer): Promise<LlmResponse> {
        try{
            const response = await this.ocrService.extractOcr(fileBuffer);
            return response;
        } catch (error) {
            console.error('Error extracting OCR:', error);
            throw error;
        }
    }

    /**
     * Converts OCR content to Markdown format.
     * @remarks This method is used to convert OCR content to Markdown format.
     * @param fileBuffer - The buffer of the file to be processed.
     * @param ocrContent - The OCR content to be converted.
     * @returns An object containing the converted Markdown content.
     */
    async convertToMarkdownFromOcr(fileBuffer: Buffer, ocrContent: string): Promise<LlmResponse> {
        try{
            const response = await this.markdownService.convertToMarkdown(fileBuffer, ocrContent);
            return response;
        } catch (error) {
            console.error('Error converting to Markdown:', error);
            throw error;
        }
    }
     
}
