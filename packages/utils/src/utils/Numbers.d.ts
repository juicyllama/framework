import { SupportedCurrencies } from '../enums/currencies';
export declare class Numbers {
    static amountToCents(number: number): number;
    static toCurrency(number: number, currency: SupportedCurrencies): string;
    static toFinancial(number: number): string;
}
