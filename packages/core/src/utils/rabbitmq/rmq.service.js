"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RmqService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
let RmqService = exports.RmqService = class RmqService {
    constructor(configService) {
        this.configService = configService;
    }
    getOptions(options) {
        var _a;
        if (!options.queue) {
            throw new Error('queue is required');
        }
        if (!options.noAck) {
            options.noAck = false;
        }
        return {
            transport: microservices_1.Transport.RMQ,
            options: {
                urls: [this.configService.get('RABBIT_MQ_URI')],
                queue: this.configService.get(`RABBIT_MQ_${options.queue}_QUEUE`),
                noAck: options.noAck,
                persistent: true,
                socketOptions: {
                    heartbeatIntervalInSeconds: 30,
                },
                prefetchCount: (_a = options.prefetchCount) !== null && _a !== void 0 ? _a : null,
            },
        };
    }
    ack(context) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();
        channel.ack(originalMessage);
    }
};
exports.RmqService = RmqService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RmqService);
//# sourceMappingURL=rmq.service.js.map