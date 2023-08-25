"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparisonOperator = void 0;
var ComparisonOperator;
(function (ComparisonOperator) {
    ComparisonOperator["GT"] = "GT";
    ComparisonOperator["GTE"] = "GTE";
    ComparisonOperator["LT"] = "LT";
    ComparisonOperator["LTE"] = "LTE";
    ComparisonOperator["EQ"] = "EQ";
    ComparisonOperator["NE"] = "!EQ";
    ComparisonOperator["IS"] = "NULL";
    ComparisonOperator["NNULL"] = "!NULL";
})(ComparisonOperator || (exports.ComparisonOperator = ComparisonOperator = {}));
