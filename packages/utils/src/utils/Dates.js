"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dates = void 0;
const stats_1 = require("../enums/stats");
const dates_1 = require("../enums/dates");
const nth = function (d) {
    if (d > 3 && d < 21)
        return 'th';
    switch (d % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
};
class Dates {
    static format(date, format) {
        date = new Date(date);
        const month = (date.getMonth() + 1).toString();
        const day = date.getDate().toString();
        const year = date.getFullYear().toString();
        const hours = date.getHours().toString();
        const minutes = date.getMinutes().toString();
        const seconds = date.getSeconds().toString();
        const milliseconds = date.getMilliseconds().toString();
        if (format === 'date')
            format = 'YYYY-MM-DD';
        if (format === 'time')
            format = 'HH:mm:ss';
        if (format === 'datetime')
            format = 'YYYY-MM-DD HH:mm:ss';
        return format
            .replace('YYYY', year)
            .replace('MMMM', dates_1.month_names[date.getMonth()])
            .replace('MMM', dates_1.month_names_short[date.getMonth()])
            .replace('MM', month.length === 1 ? '0' + month : month)
            .replace('DD', day.length === 1 ? '0' + day : day)
            .replace('Do', day + nth(parseInt(day)))
            .replace('HH', hours.length === 1 ? '0' + hours : hours)
            .replace('mm', minutes.length === 1 ? '0' + minutes : minutes)
            .replace('ss', seconds.length === 1 ? '0' + seconds : seconds)
            .replace('SSS', milliseconds.length === 1
            ? '00' + milliseconds
            : milliseconds.length === 2
                ? '0' + milliseconds
                : milliseconds);
    }
    static formatZerolessValue(value) {
        if (value < 10)
            return '0' + value;
        return String(value);
    }
    static addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    static addStep(date, step, steps) {
        if (!steps) {
            steps = 1;
        }
        switch (step) {
            case stats_1.StepType.HOURS:
                date.setHours(date.getHours() + Number(steps));
                return date;
            case stats_1.StepType.DAYS:
                date.setDate(date.getDate() + Number(steps));
                return date;
            case stats_1.StepType.WEEKS:
                date.setDate(date.getDate() + Number(steps * 7));
                return date;
            case stats_1.StepType.MONHTHS:
                date.setMonth(date.getMonth() + Number(steps));
                return date;
            case stats_1.StepType.YEARS:
                date.setFullYear(date.getFullYear() + Number(steps));
                return date;
        }
    }
    static lastMonth() {
        const start_date = new Date();
        const end_date = new Date();
        start_date.setFullYear(start_date.getFullYear());
        start_date.setMonth(start_date.getMonth() - 1);
        start_date.setDate(1);
        end_date.setFullYear(end_date.getFullYear());
        end_date.setMonth(end_date.getMonth());
        end_date.setDate(0);
        start_date.setHours(0);
        start_date.setMinutes(0);
        start_date.setSeconds(0);
        start_date.setMilliseconds(0);
        end_date.setHours(23);
        end_date.setMinutes(59);
        end_date.setSeconds(59);
        end_date.setMilliseconds(59);
        return {
            from: start_date,
            to: end_date,
        };
    }
    static isBetween(date, from, to) {
        const isBetween = (date, min, max) => date.getTime() >= min.getTime() && date.getTime() <= max.getTime();
        return isBetween(date, from, to);
    }
    static nextDate(frequency) {
        switch (frequency) {
            case dates_1.SubscriptionFrequency.DAILY:
                const day = new Date();
                day.setDate(day.getDate() + 1);
                return day;
            case dates_1.SubscriptionFrequency.WEEKLY:
                const week = new Date();
                week.setDate(week.getDate() + 7);
                return week;
            case dates_1.SubscriptionFrequency.BIWEEKLY:
                const biweek = new Date();
                biweek.setDate(biweek.getDate() + 14);
                return biweek;
            case dates_1.SubscriptionFrequency.MONTHLY:
                const monthly = new Date();
                monthly.setMonth(monthly.getMonth() + 1);
                return monthly;
            case dates_1.SubscriptionFrequency.BIMONTHLY:
                const bimonthly = new Date();
                bimonthly.setMonth(bimonthly.getMonth() + 2);
                return bimonthly;
            case dates_1.SubscriptionFrequency.QUARTERLY:
                const quarterly = new Date();
                quarterly.setMonth(quarterly.getMonth() + 3);
                return quarterly;
            case dates_1.SubscriptionFrequency.BIQUARTERLY:
                const biquarterly = new Date();
                biquarterly.setMonth(biquarterly.getMonth() + 6);
                return biquarterly;
            case dates_1.SubscriptionFrequency.YEARLY:
                const yearly = new Date();
                yearly.setFullYear(yearly.getFullYear() + 1);
                return yearly;
        }
    }
    static minutesAgo(minutes) {
        return new Date(new Date().getTime() - minutes * 60000);
    }
    static daysAgo(days) {
        return new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * days);
    }
}
exports.Dates = Dates;
