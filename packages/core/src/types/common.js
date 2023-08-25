"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.METHOD = exports.CRUD_ACTIONS = exports.HTTP_METHODS = void 0;
var HTTP_METHODS;
(function (HTTP_METHODS) {
    HTTP_METHODS["GET"] = "GET";
    HTTP_METHODS["POST"] = "POST";
    HTTP_METHODS["PUT"] = "PUT";
    HTTP_METHODS["PATCH"] = "PATCH";
    HTTP_METHODS["DELETE"] = "DELETE";
})(HTTP_METHODS || (exports.HTTP_METHODS = HTTP_METHODS = {}));
var CRUD_ACTIONS;
(function (CRUD_ACTIONS) {
    CRUD_ACTIONS["CREATE"] = "CREATE";
    CRUD_ACTIONS["READ"] = "READ";
    CRUD_ACTIONS["UPDATE"] = "UPDATE";
    CRUD_ACTIONS["DELETE"] = "DELETE";
})(CRUD_ACTIONS || (exports.CRUD_ACTIONS = CRUD_ACTIONS = {}));
var METHOD;
(function (METHOD) {
    METHOD["CREATE"] = "CREATE";
    METHOD["GET"] = "GET";
    METHOD["LIST"] = "LIST";
    METHOD["COUNT"] = "COUNT";
    METHOD["POST"] = "POST";
    METHOD["PUT"] = "PUT";
    METHOD["UPDATE"] = "UPDATE";
    METHOD["UPLOAD"] = "UPLOAD";
    METHOD["PATCH"] = "PATCH";
    METHOD["DELETE"] = "DELETE";
    METHOD["CHARTS"] = "CHARTS";
})(METHOD || (exports.METHOD = METHOD = {}));
//# sourceMappingURL=common.js.map