export declare class JLCache {
    static cacheKey(domain: string, ...optionalParams: [...any, string?]): string;
    static cacheKeyFromRoute(route: string, query?: any): string;
}
