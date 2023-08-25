import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions } from '@nestjs/microservices';
export declare class RmqService {
    private readonly configService;
    constructor(configService: ConfigService);
    getOptions(options: {
        queue: string;
        noAck?: boolean;
        prefetchCount?: number;
    }): RmqOptions;
    ack(context: RmqContext): void;
}
