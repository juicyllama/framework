"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FxRate = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const utils = __importStar(require("@juicyllama/utils"));
let FxRate = exports.FxRate = class FxRate {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FxRate.prototype, "fx_id", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, typeorm_1.Column)('date', {
        name: 'date',
        transformer: {
            to: (value) => utils.Dates.format(value, 'YYYY-MM-DD'),
            from: (value) => value,
        },
    }),
    __metadata("design:type", Date)
], FxRate.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "AUD", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "CAD", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "CHF", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "EUR", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "GBP", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "INR", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "MXN", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { default: 1.0, precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "USD", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "JPY", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "CNY", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "HKD", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "NZD", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "SEK", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "KRW", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "SGD", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "NOK", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "RUB", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "ZAR", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "TRY", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 20, scale: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FxRate.prototype, "BRL", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FxRate.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FxRate.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], FxRate.prototype, "deleted_at", void 0);
exports.FxRate = FxRate = __decorate([
    (0, typeorm_1.Entity)('fx_rates'),
    (0, typeorm_1.Unique)(['date']),
    __metadata("design:paramtypes", [Object])
], FxRate);
//# sourceMappingURL=fx.entity.js.map