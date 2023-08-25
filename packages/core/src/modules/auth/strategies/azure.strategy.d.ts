declare const AzureADStrategy_base: new (...args: any[]) => any;
export declare class AzureADStrategy extends AzureADStrategy_base {
    constructor();
    validate(data: any): Promise<any>;
}
export declare const AzureADGuard: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export {};
