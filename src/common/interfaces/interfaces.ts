export interface OcrContent {
    content: string;
    inputTokens: number;
    outputTokens: number;
    model: string;
}

export interface MarkdownContent {
    content: string;
    inputTokens: number;
    outputTokens: number;
    model: string;
}

export interface ProcessImageResponse {
    ocrContent: OcrContent;
    markdownContent: MarkdownContent;
}
