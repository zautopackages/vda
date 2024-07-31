import { Injectable } from "@nestjs/common";
import { MODEL_PARAMETERS } from "src/common/constants/model_parameters";
import { MARKDOWN_GENERATOR_PROMPT } from "src/common/prompts/markdown.prompt";
import { JsonService } from "src/common/service/json.service";
import { extractJsonFromMarkdown } from "src/common/util/extractjson";
import { LlmResponse } from "src/llm/llm.interfaces";
import { LlmService } from "src/llm/llm.service";


@Injectable()
export class MarkdownService {

    constructor(
        private readonly llmService: LlmService,
        private readonly jsonService: JsonService
    ) { }

    async convertToMarkdown(fileBuffer: Buffer, ocrText: string) :Promise<LlmResponse>{
        for (let attempt = 1; attempt <= 3; attempt++) {
            const prompt = MARKDOWN_GENERATOR_PROMPT.replace("{{ocrText}}", ocrText)
            const { temperature, top_k, top_p } = MODEL_PARAMETERS.MARKDOWN_GENERATOR_PROMPT;
            const timestamp = new Date().toISOString();
            const dynamicPrompt = `${prompt}\n\nTimestamp: ${timestamp}`
            try {
                const { content, inputTokens, outputTokens, model } = await this.llmService.generate({
                    prompt: dynamicPrompt,
                    documents: fileBuffer,
                    model: process.env.MARKDOWN_MODEL,
                    temperature,
                    top_k,
                    top_p
                });
                const newContent = extractJsonFromMarkdown(content);
                if (!newContent) {
                    console.log(`Failed to extract JSON from the response: ${content}`);
                    const correctedResponse = await this.jsonService.correctJson(newContent);
                    if (!correctedResponse) {
                        throw new Error("Failed to extract JSON from the response");
                    }
                    return {
                        content: correctedResponse,
                        inputTokens,
                        outputTokens,
                        model
                    };
                }
                return { content: newContent, inputTokens, outputTokens, model };
            } catch (error) {
                console.log(error);
                if (attempt === 3) {
                    throw new Error(`Failed after 3 attempts: ${error.message}`);
                }
            }
        }
    }
}