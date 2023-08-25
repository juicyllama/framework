export declare class ErrorResponseDto {
    statusCode: number;
    message: string[];
    error: string;
}
export declare class StatsResponseDto {
    count?: number;
    avg?: number;
    sum?: number;
}
interface ChartDataSetPoint {
    x?: string;
    y?: number;
}
interface ChartDataSetElement {
    backgroundColor?: string;
    label?: string;
    data: ChartDataSetPoint[];
}
export declare class ChartsResponseDto {
    datasets?: ChartDataSetElement[];
}
export declare class InvoicesSummaryResponseDto {
    dateFrom?: number;
    dateTo?: number;
    datasets?: ChartDataSetElement[];
}
export declare class SuccessResponseDto {
    success: boolean;
}
export declare class ProcessedResponseDto {
    created: number;
    updated: number;
    deleted: number;
}
export interface CronRecords {
    todo: number;
    processed: number;
    remaining: number;
}
export {};
