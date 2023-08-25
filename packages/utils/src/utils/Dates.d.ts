import { DateRangeDto } from '../dto/date.dto';
import { StepType } from '../enums/stats';
import { SubscriptionFrequency } from '../enums/dates';
export declare class Dates {
    static format(date: Date, format: string): string;
    private static formatZerolessValue;
    static addDays(date: Date, days: number): Date;
    static addStep(date: Date, step: StepType, steps?: number): Date;
    static lastMonth(): DateRangeDto;
    static isBetween(date: Date, from: Date, to: Date): boolean;
    static nextDate(frequency: SubscriptionFrequency): Date;
    static minutesAgo(minutes: number): Date;
    static daysAgo(days: number): Date;
}
