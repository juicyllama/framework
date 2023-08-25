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
exports.Setting = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let Setting = exports.Setting = class Setting {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Setting.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], Setting.prototype, "key", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: false }),
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", Object)
], Setting.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], Setting.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], Setting.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], Setting.prototype, "deleted_at", void 0);
exports.Setting = Setting = __decorate([
    (0, typeorm_1.Entity)('settings'),
    (0, typeorm_1.Unique)(['key']),
    __metadata("design:paramtypes", [Object])
], Setting);
//# sourceMappingURL=settings.entity.js.map