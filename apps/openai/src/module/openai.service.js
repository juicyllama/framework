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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.OpenaiService = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("@juicyllama/utils");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
let OpenaiService = class OpenaiService {
    constructor(configService, logger) {
        this.configService = configService;
        this.logger = logger;
    }
    ask(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = 'app::openai::ask';
            this.logger.debug(`[${domain}] Request: ${JSON.stringify(options, null, 2)}`);
            const params = options;
            if (!params.model) {
                params.model = 'gpt-3.5-turbo-1106';
            }
            try {
                const openai = new openai_1.default({
                    apiKey: this.configService.get('openai.OPENAI_API_KEY'),
                });
                const chatCompletion = (yield openai.chat.completions.create(params));
                this.logger.debug(`[${domain}] Response: ${JSON.stringify(chatCompletion, null, 2)}`);
                return chatCompletion;
            }
            catch (e) {
                this.logger.warn(`[${domain}] Error: ${JSON.stringify(e.message, null, 2)}`, e.response);
            }
        });
    }
};
exports.OpenaiService = OpenaiService;
exports.OpenaiService = OpenaiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => config_1.ConfigService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => utils_1.Logger))),
    __metadata("design:paramtypes", [config_1.ConfigService,
        utils_1.Logger])
], OpenaiService);
//# sourceMappingURL=openai.service.js.map