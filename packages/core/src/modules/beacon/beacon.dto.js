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
exports.BeaconMessageDto = exports.BeaconOptionsDto = exports.BeaconMessageCtaDto = exports.BeaconCommunicationDto = exports.BeaconMethodsDto = void 0;
const class_validator_1 = require("class-validator");
const email_dto_1 = require("./email/email.dto");
const account_entity_1 = require("../accounts/account.entity");
const im_dto_1 = require("./im/im.dto");
class BeaconMethodsDto {
}
exports.BeaconMethodsDto = BeaconMethodsDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BeaconMethodsDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BeaconMethodsDto.prototype, "sms", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BeaconMethodsDto.prototype, "im", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BeaconMethodsDto.prototype, "webhook", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BeaconMethodsDto.prototype, "push", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BeaconMethodsDto.prototype, "notification", void 0);
class BeaconCommunicationDto {
}
exports.BeaconCommunicationDto = BeaconCommunicationDto;
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", email_dto_1.BeaconCommunicationEmailDto)
], BeaconCommunicationDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconCommunicationDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconCommunicationDto.prototype, "event", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", im_dto_1.BeaconCommunicationImDto)
], BeaconCommunicationDto.prototype, "im", void 0);
class BeaconMessageCtaDto {
}
exports.BeaconMessageCtaDto = BeaconMessageCtaDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconMessageCtaDto.prototype, "text", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], BeaconMessageCtaDto.prototype, "url", void 0);
class BeaconOptionsDto {
}
exports.BeaconOptionsDto = BeaconOptionsDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BeaconOptionsDto.prototype, "skipJsonSave", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], BeaconOptionsDto.prototype, "roles", void 0);
class BeaconMessageDto {
}
exports.BeaconMessageDto = BeaconMessageDto;
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", BeaconMethodsDto)
], BeaconMessageDto.prototype, "methods", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", BeaconCommunicationDto)
], BeaconMessageDto.prototype, "communication", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconMessageDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconMessageDto.prototype, "markdown", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", BeaconMessageCtaDto)
], BeaconMessageDto.prototype, "cta", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], BeaconMessageDto.prototype, "json", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", BeaconOptionsDto)
], BeaconMessageDto.prototype, "options", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", account_entity_1.Account)
], BeaconMessageDto.prototype, "account", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconMessageDto.prototype, "unique", void 0);
//# sourceMappingURL=beacon.dto.js.map