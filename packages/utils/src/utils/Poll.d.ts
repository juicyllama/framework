import { AxiosRequestConfig } from 'axios';
export declare class Poll {
    url(validate: any, url: string, config?: AxiosRequestConfig, interval?: number, max_attempts?: number, domain?: string, uuid?: string): Promise<any>;
    function(validate: any, func: any, interval?: number, max_attempts?: number, domain?: string, uuid?: string): Promise<any>;
}
