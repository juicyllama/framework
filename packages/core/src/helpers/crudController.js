"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crudPurge = exports.crudDelete = exports.crudUploadCSV = exports.crudUpdate = exports.crudCharts = exports.crudStats = exports.crudFindOne = exports.crudFindAll = exports.crudCreate = void 0;
const utils_1 = require("@juicyllama/utils");
const TypeOrm_1 = require("../utils/typeorm/TypeOrm");
const common_1 = require("@nestjs/common");
const lodash_1 = __importDefault(require("lodash"));
function crudCreate(options) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield options.service.create(options.data);
    });
}
exports.crudCreate = crudCreate;
function crudFindAll(options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const where = options.tQuery.buildWhere({
            repository: options.service.repository,
            query: options.query,
            account_id: (_a = options.account_id) !== null && _a !== void 0 ? _a : null,
            search_fields: options.searchFields,
        });
        const sql_options = TypeOrm_1.TypeOrm.findOptions(options.query, where, options.order_by);
        return yield options.service.findAll(sql_options);
    });
}
exports.crudFindAll = crudFindAll;
function crudFindOne(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const PRIMARY_KEY = TypeOrm_1.TypeOrm.getPrimaryKey(options.service.repository);
        const where = Object.assign({ [PRIMARY_KEY]: options.primaryKey }, (options.account_id ? { account: { account_id: options.account_id } } : null));
        const sql_options = TypeOrm_1.TypeOrm.findOneOptions(options.query, where);
        return yield options.service.findOne(sql_options);
    });
}
exports.crudFindOne = crudFindOne;
function crudStats(options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!options.method) {
            options.method = utils_1.StatsMethods.COUNT;
        }
        const where = options.tQuery.buildWhere({
            repository: options.service.repository,
            query: options.query,
            account_id: (_a = options.account_id) !== null && _a !== void 0 ? _a : null,
            search_fields: options.searchFields,
        });
        const sql_options = {
            where: where,
        };
        switch (options.method) {
            case utils_1.StatsMethods.COUNT:
                return {
                    count: yield options.service.count(sql_options),
                };
            case utils_1.StatsMethods.AVG:
                return {
                    avg: yield options.service.avg(sql_options),
                };
            case utils_1.StatsMethods.SUM:
                return {
                    sum: yield options.service.sum(sql_options),
                };
        }
    });
}
exports.crudStats = crudStats;
function crudCharts(options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const fields = lodash_1.default.castArray(options.fields);
        const where = options.tQuery.buildWhere({
            repository: options.service.repository,
            query: options.query,
            account_id: (_a = options.account_id) !== null && _a !== void 0 ? _a : null,
            search_fields: options.searchFields,
        });
        const promises = fields.map((field) => __awaiter(this, void 0, void 0, function* () {
            return yield options.service.charts(field, {
                period: options.period,
                from: options.from,
                to: options.to,
                where: where,
            });
        }));
        const results = yield Promise.all(promises);
        const datasets = fields.map((field, index) => {
            return {
                label: field,
                data: results[index],
            };
        });
        return {
            datasets,
        };
    });
}
exports.crudCharts = crudCharts;
function crudUpdate(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const PRIMARY_KEY = TypeOrm_1.TypeOrm.getPrimaryKey(options.service.repository);
        if (options.account_id) {
            const record = yield options.service.findById(options.primaryKey);
            if (record.account.account_id !== options.account_id) {
                throw new common_1.BadRequestException(`You do not have permission to update this ${options.service.name} with #${options.primaryKey}`);
            }
        }
        return yield options.service.update(Object.assign({ [PRIMARY_KEY]: options.primaryKey }, options.data));
    });
}
exports.crudUpdate = crudUpdate;
function crudUploadCSV(file, mappers, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file) {
            throw new common_1.BadRequestException(`Missing required field: file`);
        }
        if (!Boolean(file.mimetype.match(/(csv)/))) {
            throw new common_1.BadRequestException(`Not a valid csv file`);
        }
        const csv = yield options.csvService.parseCsvFile(file);
        if (Object.keys(csv[0]).length !== mappers.length) {
            throw new common_1.BadRequestException(`Invalid CSV file. Expected ${mappers.length} columns, got ${csv[0].length}`);
        }
        const dtos = csv.map(row => {
            const dto = mappers.reduce((dto, key) => (Object.assign(Object.assign({}, dto), { [key]: row[key] })), {});
            dto['account_id'] = options.account_id;
            return lodash_1.default.omitBy(dto, lodash_1.default.isEmpty);
        });
        try {
            const { affectedRows } = yield options.service.bulkInsert(dtos);
            return { affectedRows };
        }
        catch (e) {
            throw new common_1.BadRequestException(e.message);
        }
    });
}
exports.crudUploadCSV = crudUploadCSV;
function crudDelete(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const record = yield options.service.findById(options.primaryKey);
        if (options.account_id && record.account.account_id !== options.account_id) {
            throw new common_1.BadRequestException(`You do not have permission to delete this ${options.service.name} with #${options.primaryKey}`);
        }
        return yield options.service.remove(record);
    });
}
exports.crudDelete = crudDelete;
function crudPurge(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const record = yield options.service.findById(options.primaryKey);
        if (options.account_id && record.account.account_id !== options.account_id) {
            throw new common_1.BadRequestException(`You do not have permission to delete this ${options.service.name} with #${options.primaryKey}`);
        }
        return yield options.service.purge(record);
    });
}
exports.crudPurge = crudPurge;
//# sourceMappingURL=crudController.js.map