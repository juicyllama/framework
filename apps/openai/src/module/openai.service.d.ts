import { Logger } from '@juicyllama/utils';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { DeepPartial } from 'typeorm';
export declare class OpenaiService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService, logger: Logger);
    ask(options: DeepPartial<OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>): Promise<OpenAI.Chat.ChatCompletion>;
}
