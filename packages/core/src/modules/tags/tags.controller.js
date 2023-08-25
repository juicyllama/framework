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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsController = void 0;
const utils_1 = require("@juicyllama/utils");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const tags_entity_1 = require("./tags.entity");
const tags_service_1 = require("./tags.service");
const Query_1 = require("../../utils/typeorm/Query");
const crud_decorator_1 = require("../../decorators/crud.decorator");
const tags_dtos_1 = require("./tags.dtos");
const UserAuth_decorator_1 = require("../../decorators/UserAuth.decorator");
const TypeOrm_1 = require("../../utils/typeorm/TypeOrm");
const tags_enum_1 = require("./tags.enum");
const AccountId_decorator_1 = require("../../decorators/AccountId.decorator");
const E = tags_entity_1.Tag;
const NAME = 'tag';
const SEARCH_FIELDS = ['name'];
const DEFAULT_ORDER_BY = 'name';
const PRIMARY_KEY = 'tag_id';
let TagsController = exports.TagsController = class TagsController {
    constructor(service, tQuery) {
        this.service = service;
        this.tQuery = tQuery;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.create(data.name);
        });
    }
    findAll(req, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = this.tQuery.buildWhere({
                repository: this.service.repository,
                query: query,
                account_ids: req.user.account_ids,
                search_fields: SEARCH_FIELDS,
            });
            const options = TypeOrm_1.TypeOrm.findOptions(query, where, DEFAULT_ORDER_BY);
            return yield this.service.findAll(options);
        });
    }
    stats(req, query, method) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!method) {
                method = utils_1.StatsMethods.COUNT;
            }
            if (method === utils_1.StatsMethods.AVG || method === utils_1.StatsMethods.SUM) {
                throw new common_1.BadRequestException(`Only option for this endpoint currently is COUNT`);
            }
            const where = this.tQuery.buildWhere({
                repository: this.service.repository,
                query: query,
                account_ids: req.user.account_ids,
                search_fields: SEARCH_FIELDS,
            });
            const options = {
                where: where,
            };
            switch (method) {
                case utils_1.StatsMethods.COUNT:
                    return {
                        count: yield this.service.count(options),
                    };
            }
        });
    }
    findOne(req, params, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {
                [PRIMARY_KEY]: params[PRIMARY_KEY],
            };
            const options = TypeOrm_1.TypeOrm.findOneOptions(query, where);
            return yield this.service.findOne(options);
        });
    }
    update(req, data, account_id, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.update({
                [PRIMARY_KEY]: params[PRIMARY_KEY],
                name: data.name,
            });
        });
    }
    remove(req, account_id, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield this.service.findById(params[PRIMARY_KEY]);
            return yield this.service.purge(record);
        });
    }
};
__decorate([
    (0, UserAuth_decorator_1.UserAuth)(),
    (0, crud_decorator_1.CreateDecorator)(E, NAME),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tags_dtos_1.CreateTagDto]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "create", null);
__decorate([
    (0, UserAuth_decorator_1.UserAuth)(),
    (0, crud_decorator_1.ReadManyDecorator)(E, tags_enum_1.TagsSelect, tags_enum_1.TagsOrderBy, tags_enum_1.TagsRelations, NAME),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "findAll", null);
__decorate([
    (0, UserAuth_decorator_1.UserAuth)(),
    (0, crud_decorator_1.ReadStatsDecorator)(NAME),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)('method')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "stats", null);
__decorate([
    (0, UserAuth_decorator_1.UserAuth)(),
    (0, crud_decorator_1.ReadOneDecorator)(E, PRIMARY_KEY, tags_enum_1.TagsSelect, tags_enum_1.TagsRelations, NAME),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "findOne", null);
__decorate([
    (0, UserAuth_decorator_1.UserAuth)(),
    (0, crud_decorator_1.UpdateDecorator)(E, PRIMARY_KEY, NAME),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, AccountId_decorator_1.AccountId)()),
    __param(3, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, tags_dtos_1.UpdateTagDto, Number, Object]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "update", null);
__decorate([
    (0, UserAuth_decorator_1.UserAuth)(),
    (0, crud_decorator_1.DeleteDecorator)(E, PRIMARY_KEY, NAME),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, AccountId_decorator_1.AccountId)()),
    __param(2, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "remove", null);
exports.TagsController = TagsController = __decorate([
    (0, swagger_1.ApiTags)('Tags'),
    (0, common_1.Controller)(`/${utils_1.Strings.plural(NAME)}`),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => tags_service_1.TagsService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => Query_1.Query))),
    __metadata("design:paramtypes", [tags_service_1.TagsService,
        Query_1.Query])
], TagsController);
//# sourceMappingURL=tags.controller.js.map