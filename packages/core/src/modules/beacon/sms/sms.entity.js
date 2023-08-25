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
exports.BeaconSms = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const beacon_enums_1 = require("../beacon.enums");
const beacon_dto_1 = require("../beacon.dto");
let BeaconSms = exports.BeaconSms = class BeaconSms {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BeaconSms.prototype, "sms_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', default: null, nullable: true }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", beacon_dto_1.BeaconCommunicationDto)
], BeaconSms.prototype, "communication", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconSms.prototype, "app_integration_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BeaconSms.prototype, "app_sms_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'mediumtext', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci', default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconSms.prototype, "markdown", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: beacon_enums_1.BeaconStatus.PENDING }),
    (0, class_validator_1.IsEnum)(beacon_enums_1.BeaconStatus),
    __metadata("design:type", String)
], BeaconSms.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconSms.prototype, "unique", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BeaconSms.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BeaconSms.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], BeaconSms.prototype, "sent_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], BeaconSms.prototype, "delivered_at", void 0);
exports.BeaconSms = BeaconSms = __decorate([
    (0, typeorm_1.Entity)('beacon_sms'),
    __metadata("design:paramtypes", [Object])
], BeaconSms);
//# sourceMappingURL=sms.entity.js.map