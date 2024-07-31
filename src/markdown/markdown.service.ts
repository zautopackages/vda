import { Injectable, Logger } from "@nestjs/common";
import { LLM_MODELS } from "src/common/constants/llm.models";
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

    private readonly logger = new Logger(MarkdownService.name);

    async convertToMarkdown(fileBuffer: Buffer, ocrText: string) :Promise<LlmResponse>{
        let totalInputTokens, totalOutputTokens;
        this.logger.debug(`Converting to markdown`);
        const markdownModel = process.env.MARKDOWN_MODEL;
        if (!Object.values(LLM_MODELS).includes(markdownModel)) {
            this.logger.error(`Invalid Markdown Model: ${markdownModel}`);
            throw new Error(`Model ${markdownModel} is not in the list of allowed models`);
        }
        for (let attempt = 1; attempt <= 3; attempt++) {
            const prompt = MARKDOWN_GENERATOR_PROMPT.replace("{{ocrText}}", ocrText)
            const { temperature, top_k, top_p } = MODEL_PARAMETERS.MARKDOWN_GENERATOR_PROMPT;
            const timestamp = new Date().toISOString();
            const dynamicPrompt = `${prompt}\n\nTimestamp: ${timestamp}`
            try {
                const { content, inputTokens, outputTokens, model } = await this.llmService.generate({
                    prompt: dynamicPrompt,
                    documents: fileBuffer,
                    model: markdownModel,
                    temperature,
                    top_k,
                    top_p
                });
                totalInputTokens += inputTokens;
                totalOutputTokens += outputTokens;
                const newContent = extractJsonFromMarkdown(content);
                if (!newContent) {
                    this.logger.warn(`Failed to extract JSON from the response: ${content}`);
                    const correctedResponse = await this.jsonService.correctJson(newContent);
                    if (!correctedResponse) {
                        this.logger.error(`Failed to correct JSON from the response: ${content}`);
                        throw new Error("Failed to extract JSON from the response");
                    }
                    this.logger.debug(`JSON corrected successfully`);
                    this.logger.debug(`Markdown generated successfully`);
                    return {
                        content: correctedResponse.markdown_content,
                        inputTokens: totalInputTokens,
                        outputTokens: totalOutputTokens,
                        model
                    };
                }
                this.logger.debug(`Markdown generated successfully`);
                return { content: newContent.markdown_content, inputTokens: totalInputTokens, outputTokens: totalOutputTokens, model };
            } catch (error) {
                this.logger.error(`Attempt ${attempt} failed: ${error.message}`);
                if (attempt === 3) {
                    this.logger.error(`Failed after 3 attempts: ${error.message}`);
                    throw new Error(`Failed after 3 attempts: ${error.message}`);
                }
            }
        }
    }
}