export declare class Logger {
    data(key: string, value: object): void;
    error(message: any, ...optionalParams: [...any, string?]): void;
    warn(message: any, ...optionalParams: [...any, string?]): void;
    log(message: any, ...optionalParams: [...any, string?]): void;
    debug(message: any, ...optionalParams: [...any, string?]): void;
    verbose(message: any, ...optionalParams: [...any, string?]): void;
    table(data: any): void;
    private processParams;
}
