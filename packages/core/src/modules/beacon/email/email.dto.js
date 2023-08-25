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
exports.BeaconEmailRequestDto = exports.BeaconCommunicationEmailDto = exports.BeaconCommunicationEmailDetailsDto = exports.BeaconEmailResponseDto = void 0;
const class_validator_1 = require("class-validator");
const beacon_enums_1 = require("../beacon.enums");
const beacon_dto_1 = require("../beacon.dto");
class BeaconEmailResponseDto {
}
exports.BeaconEmailResponseDto = BeaconEmailResponseDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BeaconEmailResponseDto.prototype, "app_email_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(beacon_enums_1.BeaconStatus),
    __metadata("design:type", String)
], BeaconEmailResponseDto.prototype, "status", void 0);
class BeaconCommunicationEmailDetailsDto {
}
exports.BeaconCommunicationEmailDetailsDto = BeaconCommunicationEmailDetailsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconCommunicationEmailDetailsDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], BeaconCommunicationEmailDetailsDto.prototype, "email", void 0);
class BeaconCommunicationEmailDto {
}
exports.BeaconCommunicationEmailDto = BeaconCommunicationEmailDto;
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", BeaconCommunicationEmailDetailsDto)
], BeaconCommunicationEmailDto.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", BeaconCommunicationEmailDetailsDto)
], BeaconCommunicationEmailDto.prototype, "to", void 0);
class BeaconEmailRequestDto {
}
exports.BeaconEmailRequestDto = BeaconEmailRequestDto;
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", beacon_dto_1.BeaconCommunicationDto)
], BeaconEmailRequestDto.prototype, "communication", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconEmailRequestDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconEmailRequestDto.prototype, "markdown", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", beacon_dto_1.BeaconMessageCtaDto)
], BeaconEmailRequestDto.prototype, "cta", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], BeaconEmailRequestDto.prototype, "json", void 0);
//# sourceMappingURL=email.dto.js.map