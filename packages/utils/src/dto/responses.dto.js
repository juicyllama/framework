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
exports.ProcessedResponseDto = exports.SuccessResponseDto = exports.InvoicesSummaryResponseDto = exports.ChartsResponseDto = exports.StatsResponseDto = exports.ErrorResponseDto = void 0;
const class_validator_1 = require("class-validator");
class ErrorResponseDto {
}
exports.ErrorResponseDto = ErrorResponseDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ErrorResponseDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "error", void 0);
class StatsResponseDto {
}
exports.StatsResponseDto = StatsResponseDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], StatsResponseDto.prototype, "count", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], StatsResponseDto.prototype, "avg", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], StatsResponseDto.prototype, "sum", void 0);
class ChartsResponseDto {
}
exports.ChartsResponseDto = ChartsResponseDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ChartsResponseDto.prototype, "datasets", void 0);
class InvoicesSummaryResponseDto {
}
exports.InvoicesSummaryResponseDto = InvoicesSummaryResponseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Number)
], InvoicesSummaryResponseDto.prototype, "dateFrom", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Number)
], InvoicesSummaryResponseDto.prototype, "dateTo", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], InvoicesSummaryResponseDto.prototype, "datasets", void 0);
class SuccessResponseDto {
}
exports.SuccessResponseDto = SuccessResponseDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SuccessResponseDto.prototype, "success", void 0);
class ProcessedResponseDto {
}
exports.ProcessedResponseDto = ProcessedResponseDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProcessedResponseDto.prototype, "created", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProcessedResponseDto.prototype, "updated", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProcessedResponseDto.prototype, "deleted", void 0);
