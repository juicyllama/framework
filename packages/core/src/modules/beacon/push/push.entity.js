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
exports.BeaconPush = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const beacon_enums_1 = require("../beacon.enums");
let BeaconPush = exports.BeaconPush = class BeaconPush {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BeaconPush.prototype, "push_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconPush.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', default: null, nullable: true }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], BeaconPush.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconPush.prototype, "app_integration_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: beacon_enums_1.BeaconStatus.PENDING }),
    (0, class_validator_1.IsEnum)(beacon_enums_1.BeaconStatus),
    __metadata("design:type", String)
], BeaconPush.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BeaconPush.prototype, "unique", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BeaconPush.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BeaconPush.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null, nullable: true }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], BeaconPush.prototype, "pushed_at", void 0);
exports.BeaconPush = BeaconPush = __decorate([
    (0, typeorm_1.Entity)('beacon_push'),
    __metadata("design:paramtypes", [Object])
], BeaconPush);
//# sourceMappingURL=push.entity.js.map