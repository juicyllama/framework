"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconModule = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("@juicyllama/utils");
const beacon_service_1 = require("./beacon.service");
const email_service_1 = require("./email/email.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const email_entity_1 = require("./email/email.entity");
const joi_1 = __importDefault(require("joi"));
const beacon_config_1 = __importDefault(require("../../configs/beacon.config"));
const beacon_config_joi_1 = require("../../configs/beacon.config.joi");
const configs_1 = require("../../configs");
const push_service_1 = require("./push/push.service");
const push_entity_1 = require("./push/push.entity");
const Query_1 = require("../../utils/typeorm/Query");
const sms_service_1 = require("./sms/sms.service");
const sms_entity_1 = require("./sms/sms.entity");
const notification_entity_1 = require("./notification/notification.entity");
const notification_service_1 = require("./notification/notification.service");
const users_module_1 = require("../users/users.module");
const auth_module_1 = require("../auth/auth.module");
const im_entity_1 = require("./im/im.entity");
const im_service_1 = require("./im/im.service");
let BeaconModule = exports.BeaconModule = class BeaconModule {
};
exports.BeaconModule = BeaconModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [beacon_config_1.default],
                isGlobal: true,
                validationSchema: utils_1.Env.IsNotTest() ? joi_1.default.object(beacon_config_joi_1.beaconConfigJoi) : null,
            }),
            typeorm_1.TypeOrmModule.forRoot((0, configs_1.databaseConfig)()),
            typeorm_1.TypeOrmModule.forFeature([email_entity_1.BeaconEmail, sms_entity_1.BeaconSms, push_entity_1.BeaconPush, im_entity_1.BeaconIm, notification_entity_1.BeaconNotification]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
        ],
        controllers: [],
        providers: [
            beacon_service_1.BeaconService,
            email_service_1.BeaconEmailService,
            sms_service_1.BeaconSmsService,
            push_service_1.BeaconPushService,
            im_service_1.BeaconImService,
            notification_service_1.BeaconNotificationService,
            utils_1.Logger,
            Query_1.Query,
        ],
        exports: [beacon_service_1.BeaconService],
    })
], BeaconModule);
//# sourceMappingURL=beacon.module.js.map