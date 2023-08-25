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
exports.BeaconImService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const utils_1 = require("@juicyllama/utils");
const core_1 = require("@nestjs/core");
const Query_1 = require("../../../utils/typeorm/Query");
const im_entity_1 = require("./im.entity");
const types_1 = require("../../../types");
const beacon_enums_1 = require("../beacon.enums");
let BeaconImService = exports.BeaconImService = class BeaconImService {
    constructor(query, repository, configService, logger, lazyModuleLoader) {
        this.query = query;
        this.repository = repository;
        this.configService = configService;
        this.logger = logger;
        this.lazyModuleLoader = lazyModuleLoader;
    }
    create(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const domain = 'core::beacon::im::create';
            this.logger.debug(`[${domain}] Beacon IM`, message);
            if (utils_1.Env.IsTest()) {
                this.logger.verbose(`[${domain}] Skipping as testing`);
                return;
            }
            if (message.unique && (yield this.query.findOne(this.repository, { where: { unique: message.unique } }))) {
                this.logger.log(`[${domain}] Skipping as message is already sent`);
                return;
            }
            const im_data = {
                communication: message.communication,
                markdown: message.markdown,
                unique: message.unique,
            };
            const im = yield this.query.create(this.repository, im_data);
            let service;
            if (utils_1.Modules.isInstalled('@juicyllama/app-slack')) {
                const { SlackModule, SlackService } = yield Promise.resolve().then(() => __importStar(require('@juicyllama/app-slack')));
                try {
                    const slackModule = yield this.lazyModuleLoader.load(() => SlackModule);
                    service = slackModule.get(SlackService);
                    const slackMessage = {
                        channel: message.communication.im.slack.channel,
                        text: message.markdown,
                        mrkdwn: message.markdown,
                    };
                    const result = yield service.sendMessage(slackMessage);
                    yield this.update({
                        im_id: im.im_id,
                        app_integration_name: types_1.AppIntegrationName.slack,
                        app_im_id: result.ts,
                        status: beacon_enums_1.BeaconStatus.SENT,
                        sent_at: new Date(),
                    });
                    return true;
                }
                catch (e) {
                    this.logger.error(`[${domain}] ${e.message}`, e);
                    yield this.update({
                        im_id: im.im_id,
                        app_integration_name: types_1.AppIntegrationName.slack,
                        status: beacon_enums_1.BeaconStatus.ERROR,
                    });
                    return false;
                }
            }
            if (!service) {
                this.logger.error(`No im app installed, options are: @juicyllama/app-slack`);
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
exports.BeaconImService = BeaconImService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => Query_1.Query))),
    __param(1, (0, typeorm_1.InjectRepository)(im_entity_1.BeaconIm)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => config_1.ConfigService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => utils_1.Logger))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => core_1.LazyModuleLoader))),
    __metadata("design:paramtypes", [Query_1.Query,
        typeorm_2.Repository,
        config_1.ConfigService,
        utils_1.Logger,
        core_1.LazyModuleLoader])
], BeaconImService);
//# sourceMappingURL=im.service.js.map