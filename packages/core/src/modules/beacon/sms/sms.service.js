"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconSmsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const utils_1 = require("@juicyllama/utils");
const core_1 = require("@nestjs/core");
const Query_1 = require("../../../utils/typeorm/Query");
const sms_entity_1 = require("./sms.entity");
const types_1 = require("../../../types");
const beacon_enums_1 = require("../beacon.enums");
let BeaconSmsService = exports.BeaconSmsService = class BeaconSmsService {
    constructor(query, repository, configService, logger, lazyModuleLoader) {
        this.query = query;
        this.repository = repository;
        this.configService = configService;
        this.logger = logger;
        this.lazyModuleLoader = lazyModuleLoader;
    }
    create(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = 'core::beacon::sms::create';
            this.logger.debug(`[${domain}] Beacon SMS`, message);
            if (utils_1.Env.IsTest()) {
                this.logger.verbose(`[${domain}] Skipping as testing`);
                return;
            }
            if (!message.communication.phone) {
                this.logger.error(`The message must include communication.phone number`);
                return;
            }
            if (message.unique && (yield this.query.findOne(this.repository, { where: { unique: message.unique } }))) {
                this.logger.log(`[${domain}] Skipping as message is already sent`);
                return;
            }
            const sms_data = {
                communication: message.communication,
                markdown: message.markdown,
                unique: message.unique,
            };
            const sms = yield this.query.create(this.repository, sms_data);
            let service;
            if (utils_1.Modules.isInstalled('@juicyllama/app-aws')) {
                const { AwsSnsModule, AwsSnsService } = yield Promise.resolve().then(() => __importStar(require('@juicyllama/app-aws')));
                try {
                    const awsSnsModule = yield this.lazyModuleLoader.load(() => AwsSnsModule);
                    service = awsSnsModule.get(AwsSnsService);
                    const result = yield service.send(sms);
                    if (result) {
                        yield this.update({
                            sms_id: sms.sms_id,
                            app_integration_name: types_1.AppIntegrationName.aws,
                            status: beacon_enums_1.BeaconStatus.SENT,
                            sent_at: new Date(),
                        });
                        return true;
                    }
                    else {
                        yield this.update({
                            sms_id: sms.sms_id,
                            app_integration_name: types_1.AppIntegrationName.aws,
                            status: beacon_enums_1.BeaconStatus.ERROR,
                        });
                        return false;
                    }
                }
                catch (e) {
                    this.logger.error(`[${domain}] ${e.message}`, e);
                    return false;
                }
            }
            if (!service) {
                this.logger.error(`No email app installed, options are: @juicyllama/app-aws`);
                return false;
            }
        });
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.update(this.repository, data);
        });
    }
};
exports.BeaconSmsService = BeaconSmsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => Query_1.Query))),
    __param(1, (0, typeorm_1.InjectRepository)(sms_entity_1.BeaconSms)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => config_1.ConfigService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => utils_1.Logger))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => core_1.LazyModuleLoader))),
    __metadata("design:paramtypes", [Query_1.Query,
        typeorm_2.Repository,
        config_1.ConfigService,
        utils_1.Logger,
        core_1.LazyModuleLoader])
], BeaconSmsService);
//# sourceMappingURL=sms.service.js.map