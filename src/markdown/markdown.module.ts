import { Module } from "@nestjs/common";
import { MarkdownService } from "./markdown.service";
import { CommonModule } from "src/common/common.module";
import { LlmModule } from "src/llm/llm.module";

@Module({
    imports: [CommonModule,LlmModule],
    providers: [MarkdownService],
    exports: [MarkdownService]
})
export class MarkdownModule{}