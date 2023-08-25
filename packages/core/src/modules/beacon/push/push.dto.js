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
exports.BeaconPushRequestDto = exports.BeaconPushResponseDto = void 0;
const class_validator_1 = require("class-validator");
const beacon_enums_1 = require("../beacon.enums");
class BeaconPushResponseDto {
}
exports.BeaconPushResponseDto = BeaconPushResponseDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BeaconPushResponseDto.prototype, "app_push_id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(beacon_enums_1.BeaconStatus),
    __metadata("design:type", String)
], BeaconPushResponseDto.prototype, "status", void 0);
class BeaconPushRequestDto {
}
exports.BeaconPushRequestDto = BeaconPushRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconPushRequestDto.prototype, "channel", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconPushRequestDto.prototype, "event", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], BeaconPushRequestDto.prototype, "data", void 0);
//# sourceMappingURL=push.dto.js.map