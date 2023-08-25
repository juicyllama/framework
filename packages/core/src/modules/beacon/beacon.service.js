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
exports.BeaconService = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("./email/email.service");
const push_service_1 = require("./push/push.service");
const sms_service_1 = require("./sms/sms.service");
const notification_service_1 = require("./notification/notification.service");
const im_service_1 = require("./im/im.service");
let BeaconService = exports.BeaconService = class BeaconService {
    constructor(beaconEmailService, beaconPushService, beaconSmsService, beaconImService, beaconNotificationService) {
        this.beaconEmailService = beaconEmailService;
        this.beaconPushService = beaconPushService;
        this.beaconSmsService = beaconSmsService;
        this.beaconImService = beaconImService;
        this.beaconNotificationService = beaconNotificationService;
    }
    notify(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = false;
            if (message.methods.email) {
                result = yield this.beaconEmailService.create(message);
            }
            if (message.methods.sms) {
                result = yield this.beaconSmsService.create(message);
            }
            if (message.methods.im) {
                result = yield this.beaconImService.create(message);
            }
            if (message.methods.webhook) {
            }
            if (message.methods.push) {
                result = yield this.beaconPushService.create(message);
            }
            if (message.methods.notification) {
                result = !!(yield this.beaconNotificationService.create(message));
            }
            return result;
        });
    }
    sendPush(event, json) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.notify({
                methods: {
                    push: true,
                },
                communication: {
                    event: event,
                },
                json: json,
            });
        });
    }
};
exports.BeaconService = BeaconService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => email_service_1.BeaconEmailService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => push_service_1.BeaconPushService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => sms_service_1.BeaconSmsService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => im_service_1.BeaconImService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => notification_service_1.BeaconNotificationService))),
    __metadata("design:paramtypes", [email_service_1.BeaconEmailService,
        push_service_1.BeaconPushService,
        sms_service_1.BeaconSmsService,
        im_service_1.BeaconImService,
        notification_service_1.BeaconNotificationService])
], BeaconService);
//# sourceMappingURL=beacon.service.js.map