"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const config_2 = require("@nestjs/config");
const cache_manager_redis_store_1 = require("cache-manager-redis-store");
exports.default = (0, config_1.registerAs)('cache', () => ({
    isGlobal: true,
    inject: [config_2.ConfigService],
    useFactory: (configService) => __awaiter(void 0, void 0, void 0, function* () {
        const store = yield (0, cache_manager_redis_store_1.redisStore)({
            socket: {
                host: configService.get('REDIS_HOST'),
                port: +configService.get('REDIS_PORT'),
            },
            password: configService.get('REDIS_PASSWORD'),
        });
        return {
            store: store,
            ttl: 5,
        };
    }),
}));
//# sourceMappingURL=cache.config.js.map