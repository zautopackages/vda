import { Module } from '@nestjs/common';
import { LlmModule } from 'src/llm/llm.module';
import { JsonService } from './service/json.service';

@Module({
    imports: [LlmModule],
    controllers: [],
    providers: [JsonService],
    exports: [JsonService],
})
export class CommonModule {}
