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
exports.BeaconEmail = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const beacon_enums_1 = require("../beacon.enums");
const beacon_dto_1 = require("../beacon.dto");
let BeaconEmail = exports.BeaconEmail = class BeaconEmail {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BeaconEmail.prototype, "email_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', default: null, nullable: true }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", beacon_dto_1.BeaconCommunicationDto)
], BeaconEmail.prototype, "communication", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconEmail.prototype, "app_integration_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BeaconEmail.prototype, "app_email_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci', default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconEmail.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'mediumtext', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci', default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconEmail.prototype, "markdown", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', default: null, nullable: true }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], BeaconEmail.prototype, "cta", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: beacon_enums_1.BeaconStatus.PENDING }),
    (0, class_validator_1.IsEnum)(beacon_enums_1.BeaconStatus),
    __metadata("design:type", String)
], BeaconEmail.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconEmail.prototype, "unique", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BeaconEmail.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BeaconEmail.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], BeaconEmail.prototype, "sent_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], BeaconEmail.prototype, "delivered_at", void 0);
exports.BeaconEmail = BeaconEmail = __decorate([
    (0, typeorm_1.Entity)('beacon_email'),
    __metadata("design:paramtypes", [Object])
], BeaconEmail);
//# sourceMappingURL=email.entity.js.map