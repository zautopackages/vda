import { Injectable } from '@nestjs/common';
import { BedRockService } from './client/bed-rock.service';
import { LLM_MODELS } from 'src/common/constants/llm.models';
import { LlmRequest } from './llm.interfaces';

@Injectable()
export class LlmService {

    private readonly clients:Map<string,any> = new Map()

    constructor(
        private readonly bedRockService: BedRockService,
      ) 
      {
        this.clients.set(LLM_MODELS.ANTHROPIC_CLAUDE_3_HAIKU,this.bedRockService)
        this.clients.set(LLM_MODELS.ANTHROPIC_CLAUDE_3_SONNET, this.bedRockService)
        this.clients.set(LLM_MODELS.ANTHROPIC_CLAUDE_3_5_SONNET, this.bedRockService)
        this.clients.set(LLM_MODELS.MISTRAL_MISTRAL_7B_INSTRUCT, this.bedRockService)
        this.clients.set(LLM_MODELS.LLAMA_3, this.bedRockService)
      }


    async getClient(model:string){
        const client = this.clients.get(model)
        if(!client){
            throw new Error(`No client found for model ${model}`)
        }
        return client
    }

    async generate(llmRequest:LlmRequest){
        try{
            const client = await this.getClient(llmRequest.model)
            return await client.generate(llmRequest)
        } catch (error){
            console.log(error);
        }
    }
}
