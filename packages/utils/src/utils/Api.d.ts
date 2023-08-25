import { RawAxiosRequestConfig } from 'axios';
export declare class Api {
    get(domain: string, url: string, config?: RawAxiosRequestConfig, uuid?: string, interceptor?: any): Promise<any | boolean>;
    post(domain: string, url: string, data?: object | string, config?: RawAxiosRequestConfig, uuid?: string): Promise<any | boolean>;
    patch(domain: string, url: string, data?: object, config?: RawAxiosRequestConfig, uuid?: string): Promise<any | boolean>;
    put(domain: string, url: string, data?: object, config?: RawAxiosRequestConfig, uuid?: string): Promise<any | boolean>;
    delete(domain: string, url: string, config?: RawAxiosRequestConfig, uuid?: string): Promise<boolean>;
    defaultConfig(): RawAxiosRequestConfig;
    processError(e: any, method: any, url: any, domain?: any, config?: any, data?: any, uuid?: any): boolean;
}
