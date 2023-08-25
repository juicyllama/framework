export declare class FxRate {
    readonly fx_id: number;
    date: Date;
    readonly AUD: number;
    readonly CAD: number;
    readonly CHF: number;
    readonly EUR: number;
    readonly GBP: number;
    readonly INR: number;
    readonly MXN: number;
    readonly USD: number;
    readonly JPY: number;
    readonly CNY: number;
    readonly HKD: number;
    readonly NZD: number;
    readonly SEK: number;
    readonly KRW: number;
    readonly SGD: number;
    readonly NOK: number;
    readonly RUB: number;
    readonly ZAR: number;
    readonly TRY: number;
    readonly BRL: number;
    readonly created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    constructor(partial: Partial<FxRate>);
}
