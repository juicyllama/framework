"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSV_FIELDS = exports.PRIMARY_KEY = exports.DEFAULT_ORDER_BY = exports.SEARCH_FIELDS = exports.NAME = exports.E = void 0;
const users_entity_1 = require("./users.entity");
exports.E = users_entity_1.User;
exports.NAME = 'user';
exports.SEARCH_FIELDS = ['first_name', 'last_name', 'email'];
exports.DEFAULT_ORDER_BY = 'first_name';
exports.PRIMARY_KEY = 'user_id';
exports.CSV_FIELDS = ['first_name', 'last_name', 'email'];
//# sourceMappingURL=users.constants.js.map