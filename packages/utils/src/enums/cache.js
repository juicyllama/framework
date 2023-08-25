"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachePeriod = void 0;
var CachePeriod;
(function (CachePeriod) {
    CachePeriod[CachePeriod["NEVER"] = 0] = "NEVER";
    CachePeriod[CachePeriod["MINUTE"] = 60] = "MINUTE";
    CachePeriod[CachePeriod["TWENTY"] = 1200] = "TWENTY";
    CachePeriod[CachePeriod["HOUR"] = 3600] = "HOUR";
    CachePeriod[CachePeriod["DAY"] = 86400] = "DAY";
    CachePeriod[CachePeriod["WEEK"] = 604800] = "WEEK";
    CachePeriod[CachePeriod["MONTH"] = 2419200] = "MONTH";
    CachePeriod[CachePeriod["YEAR"] = 31535965] = "YEAR";
})(CachePeriod || (exports.CachePeriod = CachePeriod = {}));
