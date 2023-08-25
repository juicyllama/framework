"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMySQLTimeInterval = exports.ChartsPeriod = void 0;
var ChartsPeriod;
(function (ChartsPeriod) {
    ChartsPeriod["MIN"] = "MIN";
    ChartsPeriod["15MIN"] = "15MIN";
    ChartsPeriod["30MIN"] = "30MIN";
    ChartsPeriod["HOUR"] = "HOUR";
    ChartsPeriod["DAY"] = "DAY";
    ChartsPeriod["WEEK"] = "WEEK";
    ChartsPeriod["MONTH"] = "MONTH";
    ChartsPeriod["YEAR"] = "YEAR";
})(ChartsPeriod || (exports.ChartsPeriod = ChartsPeriod = {}));
function getMySQLTimeInterval(period) {
    switch (period) {
        case ChartsPeriod.MIN:
            return 'FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(created_at) / 60) * 60)';
        case ChartsPeriod['15MIN']:
            return 'FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(created_at) / (15 * 60)) * (15 * 60))';
        case ChartsPeriod['30MIN']:
            return 'FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(created_at) / (30 * 60)) * (30 * 60))';
        case ChartsPeriod.HOUR:
            return 'FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(created_at) / (60 * 60)) * (60 * 60))';
        case ChartsPeriod.DAY:
            return 'FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(created_at) / (24 * 60 * 60)) * (24 * 60 * 60))';
        case ChartsPeriod.WEEK:
            return 'FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(created_at) / (7 * 24 * 60 * 60)) * (7 * 24 * 60 * 60))';
        case ChartsPeriod.MONTH:
            return "DATE_FORMAT(created_at, '%Y-%m-01')";
        case ChartsPeriod.YEAR:
            return "DATE_FORMAT(created_at, '%Y-01-01')";
        default:
            throw new Error(`Unsupported period: ${period}`);
    }
}
exports.getMySQLTimeInterval = getMySQLTimeInterval;
