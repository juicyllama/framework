"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomNamingStrategy = void 0;
const typeorm_1 = require("typeorm");
const crypto_1 = __importDefault(require("crypto"));
class CustomNamingStrategy extends typeorm_1.DefaultNamingStrategy {
    foreignKeyName(tableOrName, columnNames, referencedTablePath) {
        tableOrName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
        const name = columnNames.reduce((name, column) => `${name}_${column}_${tableOrName}`, `${tableOrName}_${referencedTablePath}`);
        return `fk_${crypto_1.default.createHash('md5').update(name).digest('hex')}`;
    }
    primaryKeyName(tableOrName, columnNames, referencedTablePath) {
        tableOrName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
        const name = columnNames.reduce((name, column) => `${name}_${column}_${tableOrName}`, `${tableOrName}_${referencedTablePath}`);
        return `pk_${crypto_1.default.createHash('md5').update(name).digest('hex')}`;
    }
}
exports.CustomNamingStrategy = CustomNamingStrategy;
//# sourceMappingURL=naming.strategy.js.map