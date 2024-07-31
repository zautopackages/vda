import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { LLM_MODELS } from 'src/common/constants/llm.models';
import { MODEL_PARAMETERS } from 'src/common/constants/model_parameters';
import { SERVE_STATIC_PATH } from 'src/common/constants/system.constants';
import { OCR_CORRECTER_PROMPT } from 'src/common/prompts/markdown.prompt';
import { JsonService } from 'src/common/service/json.service';
import { extractJsonFromMarkdown } from 'src/common/util/extractjson';
import { LlmService } from 'src/llm/llm.service';
const Tesseract = require('tesseract.js');

const rootPath = process.cwd();

@Injectable()
export class OcrService {

    constructor(
        private readonly llmService: LlmService,
        private readonly jsonService: JsonService
    ) { }


    async recognize(filepath: string): Promise<string> {
        try {
            const path = join(rootPath, SERVE_STATIC_PATH, filepath);
            const result = await this.tesseract(path);
            const documents = fs.readFileSync(path);
            const { temperature, top_k, top_p } = MODEL_PARAMETERS.OCR_CORRECTER_PROMPT;
    
            for (let retry = 1; retry <= 3; retry++) {
                const timestamp = new Date().toISOString();
                const prompt = OCR_CORRECTER_PROMPT.replace("{{ocr_content}}", result);
                const dynamicPrompt = `${prompt}\n\nTimestamp: ${timestamp}`;
    
                try {
                    const { content, inputTokens, outputTokens, model } = await this.llmService.generate({
                        prompt: dynamicPrompt,
                        documents,
                        model: LLM_MODELS.bedrock.ANTHROPIC_CLAUDE_3_SONNET,
                        temperature,
                        top_k,
                        top_p
                    });
                    const response = extractJsonFromMarkdown(content);
                    if(!response){
                        console.log(`Failed to extract JSON from the response: ${content}`);
                        const correctedResponse =await this.jsonService.correctJson(content)
                        if(!correctedResponse){
                            throw new Error("Failed to extract JSON from the response");
                        }
                        return correctedResponse.corrected_text;
                    }
                    return response.corrected_text;
                } catch (error) {
                    console.error(`Attempt ${retry} failed: ${error.message}`);
                    if (retry === 3) throw new Error(`Failed after 3 attempts: ${error.message}`);
                }
            }
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async tesseract(path: string): Promise<string> {
        try {
            const result = await Tesseract.recognize(path, 'eng');
            return result.data.text;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }
}
