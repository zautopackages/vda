import { Injectable } from "@nestjs/common";
import { LlmService } from "src/llm/llm.service";
import { LLM_MODELS } from "../constants/llm.models";
import { extractJsonFromMarkdown } from "../util/extractjson";
import { JSON_CORRECTOR_PROMPT } from "../prompts/json-corrector.prompt";

@Injectable()
export class JsonService{
    constructor(
        private readonly llmService:LlmService
    ){

    }

    async correctJson(input:string){
        const prompt = JSON_CORRECTOR_PROMPT.replace("{{incorrect_json}}",input)
        const dynamicPrompt = `${prompt}\n\nTimestamp: ${new Date().toISOString()}`;
        try{
            const { content } = await this.llmService.generate({prompt:dynamicPrompt,model: LLM_MODELS.ANTHROPIC_CLAUDE_3_SONNET});
            const response = extractJsonFromMarkdown(content)
            if(!response){
                console.log(`Failed to extract JSON from the corrected response: ${content}`);
                return null;
            }
            return response
        } catch(e){
            console.log(`Failed to correct JSON: ${e.message}`);
            return null;
        }
    }
}