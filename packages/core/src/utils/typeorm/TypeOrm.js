"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrm = void 0;
const typeorm_1 = require("typeorm");
const lodash_1 = require("lodash");
class TypeOrm {
    static findOptions(query, where, default_sort) {
        var _a, _b, _c, _d, _e;
        if (query.select) {
            query.select = query.select.split(',');
        }
        if (query.relations) {
            query.relations = query.relations.split(',');
        }
        const options = {
            take: (_a = query.limit) !== null && _a !== void 0 ? _a : 20,
            skip: (_b = query.offset) !== null && _b !== void 0 ? _b : 0,
            order: query.order_by ? { [query.order_by]: (_c = query.order_by_type) !== null && _c !== void 0 ? _c : 'ASC' } : { [default_sort]: 'ASC' },
            select: (_d = query.select) !== null && _d !== void 0 ? _d : null,
            relations: (_e = query.relations) !== null && _e !== void 0 ? _e : null,
            where: where,
        };
        return (0, lodash_1.omitBy)(options, lodash_1.isNil);
    }
    static findOneOptions(query, where) {
        var _a, _b;
        if (query.select) {
            query.select = query.select.split(',');
        }
        if (query.relations) {
            query.relations = query.relations.split(',');
        }
        const options = {
            select: (_a = query.select) !== null && _a !== void 0 ? _a : null,
            relations: (_b = query.relations) !== null && _b !== void 0 ? _b : null,
            where: where,
        };
        return (0, lodash_1.omitBy)(options, lodash_1.isNil);
    }
    static findAllOptionsWrapper(repository, options) {
        options = this.handleEmptyOptions(repository, options);
        options = this.handleEmptyWhere(repository, options);
        options = this.handleEmptyRelations(repository, options);
        options = this.filterOutInvalidSelectValues(repository, options);
        return options;
    }
    static findOneOptionsWrapper(repository, options) {
        options = this.handleEmptyOptions(repository, options);
        options = this.handleEmptyRelations(repository, options);
        options = this.filterOutInvalidSelectValues(repository, options);
        return options;
    }
    static filterOutInvalidSelectValues(repository, options) {
        if (options === null || options === void 0 ? void 0 : options.select) {
            options.select = options.select;
            const validSelectValues = repository.metadata.columns.map(column => column.propertyName);
            options.select = options.select.filter((select) => validSelectValues.includes(select));
        }
        return options;
    }
    static handleEmptyOptions(repository, options) {
        if (!options) {
            options = {
                where: {
                    [this.getPrimaryKey(repository)]: (0, typeorm_1.MoreThan)(0),
                },
                order: {
                    created_at: 'DESC',
                },
            };
        }
        return options;
    }
    static handleEmptyWhere(repository, options) {
        if (options) {
            if (!options.where) {
                options.where = {
                    [this.getPrimaryKey(repository)]: (0, typeorm_1.MoreThan)(0),
                };
            }
        }
        return options;
    }
    static handleEmptyRelations(repository, options) {
        const relations = repository.metadata.relations.map(relation => relation.propertyName);
        if (!(options === null || options === void 0 ? void 0 : options.relations)) {
            options.relations = relations;
        }
        return options;
    }
    static getPrimaryKey(repository) {
        return repository.metadata.columns.find(column => {
            if (column.isPrimary) {
                return column;
            }
        }).propertyName;
    }
}
exports.TypeOrm = TypeOrm;
//# sourceMappingURL=TypeOrm.js.map