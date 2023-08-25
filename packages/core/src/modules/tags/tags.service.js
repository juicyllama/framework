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
exports.TagsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tags_entity_1 = require("./tags.entity");
const utils_1 = require("@juicyllama/utils");
const Query_1 = require("../../utils/typeorm/Query");
const cache_key = 'utils::tags';
const E = tags_entity_1.Tag;
let TagsService = exports.TagsService = class TagsService {
    constructor(query, repository, cacheManager) {
        this.query = query;
        this.repository = repository;
        this.cacheManager = cacheManager;
    }
    createFromStrings(tags) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTags = [];
            for (const tag of tags) {
                const newTag = yield this.create(tag);
                newTags.push(newTag);
            }
            return newTags;
        });
    }
    create(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield this.findByName(name.toUpperCase());
            if (tag)
                return tag;
            return yield this.query.create(this.repository, { name: name.toUpperCase() });
        });
    }
    findAll(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.findAll(this.repository, options);
        });
    }
    findOne(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.findOne(this.repository, options);
        });
    }
    findById(id, relations) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.findOneById(this.repository, id, relations);
        });
    }
    findUnused() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findAll({
                where: {
                    tag_id: (0, typeorm_2.MoreThanOrEqual)(1),
                },
            });
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let tag = yield this.cacheManager.get(utils_1.JLCache.cacheKey(cache_key, name.toUpperCase()));
            if (tag)
                return tag;
            tag = yield this.repository.findOne({
                where: { name: name.toUpperCase() },
            });
            if (tag) {
                yield this.cacheManager.set(utils_1.JLCache.cacheKey(cache_key, name.toUpperCase()), tag, utils_1.CachePeriod.HOUR);
            }
            return tag;
        });
    }
    count(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.count(this.repository, options);
        });
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.update(this.repository, data);
        });
    }
    purge(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query.purge(this.repository, tag);
        });
    }
};
exports.TagsService = TagsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => Query_1.Query))),
    __param(1, (0, typeorm_1.InjectRepository)(E)),
    __param(2, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Query_1.Query,
        typeorm_2.Repository, Object])
], TagsService);
//# sourceMappingURL=tags.service.js.map