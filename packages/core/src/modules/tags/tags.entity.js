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
exports.Tag = void 0;
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Tag = exports.Tag = class Tag {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, swagger_1.ApiProperty)({ description: 'The tag ID', example: 1 }),
    __metadata("design:type", Number)
], Tag.prototype, "tag_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of your tag', example: 'TAG' }),
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], Tag.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Tag.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], Tag.prototype, "deleted_at", void 0);
exports.Tag = Tag = __decorate([
    (0, typeorm_1.Entity)('tags'),
    (0, typeorm_1.Unique)('tag_UNIQUE', ['name']),
    __metadata("design:paramtypes", [Object])
], Tag);
//# sourceMappingURL=tags.entity.js.map