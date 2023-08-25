export declare enum ChartsPeriod {
    MIN = "MIN",
    '15MIN' = "15MIN",
    '30MIN' = "30MIN",
    HOUR = "HOUR",
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH",
    YEAR = "YEAR"
}
export declare function getMySQLTimeInterval(period: ChartsPeriod): string;
