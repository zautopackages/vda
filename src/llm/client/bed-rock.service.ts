import { BedrockRuntime } from '@aws-sdk/client-bedrock-runtime'
import { Injectable } from '@nestjs/common';
import { LlmRequest, LlmResponse } from '../llm.interfaces';

@Injectable()
export class BedRockService{

    async getClient(): Promise<any> {
        const client = new BedrockRuntime({
            region: "us-east-1",
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY,
              secretAccessKey: process.env.AWS_SECRET_KEY,
            },
          });
        return client;
    }
    async generate(llmRequest:LlmRequest): Promise<LlmResponse> {
        try
        {
            const client = await this.getClient();
            let arrayOfDocuments = [];
            if(llmRequest.documents){
                arrayOfDocuments = (Array.isArray(llmRequest.documents)) ? llmRequest.documents : [llmRequest.documents]
            }
            let documents = [];
            for (let document of arrayOfDocuments) {
                documents.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: document.toString('base64') } });
            }
            documents.push({ type: "text", text: llmRequest.prompt });
            const messages = [
                {
                    role: "user",
                    content: documents
                }
            ];
            const params = {
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 2048,
                system: "assistant",
                messages: messages,
                temperature: llmRequest.temperature ||  1,
                top_p: llmRequest.top_p || 1,
                top_k: llmRequest.top_k || 50,
                stop_sequences: ["\\n\\nHuman:"]
            };
            const data = await client.invokeModel({
                modelId: llmRequest.model,
                contentType: "application/json",
                accept: "application/json",
                body: JSON.stringify(params),
            });
            if (!data) 
            {
                throw new Error("AWS Bedrock Claude Error");
            } 
            else 
            {
                const response_body = JSON.parse(new TextDecoder("utf-8").decode(data.body));
                return {
                content:response_body.content[0].text,
                inputTokens: response_body.usage.input_tokens,
                outputTokens: response_body.usage.output_tokens,
                model: llmRequest.model
                };
            }
        }
        catch(err){
            console.log(err);
            throw new Error("AWS Bedrock Claude Error");
        }
    }

}
