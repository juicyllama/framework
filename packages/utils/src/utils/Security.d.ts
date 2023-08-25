export declare class Security {
    static hashPassword(password: string): string;
    static referrerCheck(referrer: string, domain: string): boolean;
}
