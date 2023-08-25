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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconPushService = void 0;
const common_1 = require("@nestjs/common");
const push_entity_1 = require("./push.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const utils_1 = require("@juicyllama/utils");
const beacon_enums_1 = require("../beacon.enums");
const config_1 = require("@nestjs/config");
const Query_1 = require("../../../utils/typeorm/Query");
let BeaconPushService = exports.BeaconPushService = class BeaconPushService {
    constructor(query, repository, logger, configService) {
        this.query = query;
        this.repository = repository;
        this.logger = logger;
        this.configService = configService;
    }
    create(message) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            const domain = 'utils::beacon::push::create';
            if (utils_1.Env.IsTest()) {
                this.logger.verbose(`[${domain}] Skipping as testing`);
                return true;
            }
            if (!message.communication.event) {
                this.logger.error(`The message must include communication.event details`);
                return false;
            }
            if (message.unique && (yield this.query.findOne(this.repository, { where: { unique: message.unique } }))) {
                this.logger.log(`[${domain}] Skipping as message is already sent`);
                return;
            }
            const push = yield this.query.create(this.repository, {
                event: message.communication.event,
                data: ((_a = message.options) === null || _a === void 0 ? void 0 : _a.skipJsonSave) ? null : (_b = message.json) !== null && _b !== void 0 ? _b : null,
                unique: message.unique,
            });
            let service;
            let app_integration_name;
            if (utils_1.Modules.isInstalled('pusher')) {
                app_integration_name = 'pusher';
                service = require('pusher');
                if (!this.configService.get('beacon.PUSHER_APP_ID') ||
                    !this.configService.get('beacon.PUSHER_APP_KEY') ||
                    !this.configService.get('beacon.PUSHER_APP_SECRET') ||
                    !this.configService.get('beacon.PUSHER_APP_CLUSTER') ||
                    !this.configService.get('beacon.PUSHER_CHANNEL')) {
                    this.logger.warn(`[${domain}] Missing pusher config details`, {
                        config: {
                            app_id: this.configService.get('beacon.PUSHER_APP_ID'),
                            app_key: this.configService.get('beacon.PUSHER_APP_KEY'),
                            app_secret: '*********',
                            app_cluster: this.configService.get('beacon.PUSHER_APP_CLUSTER'),
                            channel: this.configService.get('beacon.PUSHER_CHANNEL'),
                        },
                    });
                    return false;
                }
                const pusher = new service({
                    appId: this.configService.get('beacon.PUSHER_APP_ID'),
                    key: this.configService.get('beacon.PUSHER_APP_KEY'),
                    secret: this.configService.get('beacon.PUSHER_APP_SECRET'),
                    cluster: this.configService.get('beacon.PUSHER_APP_CLUSTER'),
                    useTLS: this.configService.get('beacon.PUSHER_USE_TLS'),
                });
                pusher.trigger(this.configService.get('beacon.PUSHER_CHANNEL'), message.communication.event, ((_c = message.options) === null || _c === void 0 ? void 0 : _c.skipJsonSave) ? null : (_d = message.json) !== null && _d !== void 0 ? _d : null);
                this.logger.log(`[${domain}] Message Sent! Channel = ${this.configService.get('beacon.PUSHER_CHANNEL')} | event = ${message.communication.event} | data = ${JSON.stringify(((_e = message.options) === null || _e === void 0 ? void 0 : _e.skipJsonSave) ? null : (_f = message.json) !== null && _f !== void 0 ? _f : null)}`);
                yield this.query.update(this.repository, {
                    push_id: push.push_id,
                    app_integration_name: app_integration_name,
                    status: beacon_enums_1.BeaconStatus.SENT,
                    pushed_at: new Date(),
                });
                return true;
            }
            if (!service) {
                this.logger.warn(`No push app installed`);
                return false;
            }
        });
    }
};
exports.BeaconPushService = BeaconPushService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => Query_1.Query))),
    __param(1, (0, typeorm_1.InjectRepository)(push_entity_1.BeaconPush)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => utils_1.Logger))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => config_1.ConfigService))),
    __metadata("design:paramtypes", [Query_1.Query,
        typeorm_2.Repository,
        utils_1.Logger,
        config_1.ConfigService])
], BeaconPushService);
//# sourceMappingURL=push.service.js.map