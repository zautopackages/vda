import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { LLM_MODELS } from 'src/common/constants/llm.models';
import { MODEL_PARAMETERS } from 'src/common/constants/model_parameters';
import { SERVE_STATIC_PATH } from 'src/common/constants/system.constants';
import { OCR_CORRECTER_PROMPT } from 'src/common/prompts/markdown.prompt';
import { JsonService } from 'src/common/service/json.service';
import { extractJsonFromMarkdown } from 'src/common/util/extractjson';
import { LlmResponse } from 'src/llm/llm.interfaces';
import { LlmService } from 'src/llm/llm.service';
const Tesseract = require('tesseract.js');

const rootPath = process.cwd();

@Injectable()
export class OcrService {
    private readonly logger = new Logger(OcrService.name);

    constructor(
        private readonly llmService: LlmService,
        private readonly jsonService: JsonService
    ) { }

    async extractOcr(fileBuffer: Buffer): Promise<LlmResponse> {
        this.logger.debug(`Extracting OCR from image`);
        let result: string;
        let totalInputTokens, totalOutputTokens;
        try {
            this.logger.debug(`Extracting Tesseract OCR`);
            const tempFilePath = join(rootPath, SERVE_STATIC_PATH, `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`);
            fs.writeFileSync(tempFilePath, fileBuffer);
            result = await this.tesseract(tempFilePath);
            const documents = fs.readFileSync(tempFilePath);
            fs.unlinkSync(tempFilePath);
            this.logger.debug(`Tesseract OCR extracted successfully`);
            this.logger.debug(`Correcting OCR with LLM`);
            const { temperature, top_k, top_p } = MODEL_PARAMETERS.OCR_CORRECTER_PROMPT;
            const ocrModel = process.env.OCR_MODEL;
            if (!Object.values(LLM_MODELS).includes(ocrModel)) {
                this.logger.error(`Invalid OCR model: ${ocrModel}`);
                throw new Error(`Model ${ocrModel} is not in the list of allowed models`);
            }
            for (let retry = 1; retry <= 3; retry++) {
                const timestamp = new Date().toISOString();
                const prompt = OCR_CORRECTER_PROMPT.replace("{{ocr_content}}", result);
                const dynamicPrompt = `${prompt}\n\nTimestamp: ${timestamp}`;
                try {
                    const { content, inputTokens, outputTokens, model } = await this.llmService.generate({
                        prompt: dynamicPrompt,
                        documents,
                        model: ocrModel,
                        temperature,
                        top_k,
                        top_p
                    });
                    totalInputTokens += inputTokens;
                    totalOutputTokens += outputTokens;
                    const response = extractJsonFromMarkdown(content);
                    if (!response) {
                        this.logger.warn(`Failed to extract JSON from the response: ${content}`);
                        const correctedResponse = await this.jsonService.correctJson(content);
                        if (!correctedResponse) {
                            this.logger.error(`Failed to correct JSON from the response: ${content}`);
                            throw new Error(`Failed to extract JSON from the response: ${correctedResponse}`);
                        }
                        this.logger.debug(`JSON corrected successfully`);
                        this.logger.debug(`OCR extracted successfully`);
                        return { content: correctedResponse.corrected_text, inputTokens: totalInputTokens, outputTokens:totalOutputTokens, model };
                    }
                    this.logger.debug(`OCR extracted successfully`);
                    return { content: response.corrected_text, inputTokens: totalInputTokens, outputTokens:totalOutputTokens, model };
                } catch (error) {
                    this.logger.error(`Attempt ${retry} failed: ${error.message}`);
                    if (retry === 3) throw new Error(`Failed after 3 attempts: ${error.message}`);
                }
            }
        } catch (err) {
            this.logger.error(`Error extracting OCR: ${err.message}`);
        }

        if (result) {
            this.logger.debug(`Returning Tesseract OCR result as fallback`);
            return { content: result, inputTokens: 0, outputTokens: 0, model: 'Tesseract' };
        }

        this.logger.error(`OCR extraction failed completely`);
        return null;
    }

    async tesseract(path: string): Promise<string> {
        try {
            const result = await Tesseract.recognize(path, 'eng');
            return result.data.text;
        } catch (err) {
            this.logger.error(`Tesseract OCR failed: ${err.message}`);
            return null;
        }
    }
}
