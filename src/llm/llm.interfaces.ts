export interface LlmResponse {
    content: any;
    inputTokens: number;
    outputTokens: number;
    model: string;
}

export class LlmRequest {
    prompt: string;
    model: string;
    documents?: Buffer | Buffer[];
    temperature?: number;
    top_p?: number;
    top_k?: number;

    constructor(prompt: string, documents?: Buffer | Buffer[],temperature: number = 0.7,top_p: number = 1, top_k: number = 250 ) {
        this.prompt = prompt;
        this.temperature = temperature;
        this.documents = documents;
        this.top_p = top_p;
        this.top_k = top_k;
    }
}