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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const constants_1 = require("../constants");
const path_1 = __importDefault(require("path"));
const utils_1 = require("@juicyllama/utils");
exports.default = (0, config_1.registerAs)('mongodb', () => ({
    name: constants_1.MONGODB,
    imports: [config_1.ConfigModule],
    useFactory: () => __awaiter(void 0, void 0, void 0, function* () {
        return {
            type: 'mongodb',
            url: process.env.MONGODB_URL,
            entities: [path_1.default.resolve(__dirname, '**', '*.entity.mongo.{ts,js}')],
            autoLoadEntities: true,
            synchronize: false,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            ssl: utils_1.Env.IsProd() || utils_1.Env.IsSandbox(),
            authSource: utils_1.Env.IsProd() || utils_1.Env.IsSandbox() ? 'admin' : null,
        };
    }),
}));
//# sourceMappingURL=mongodb.config.js.map