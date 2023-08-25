import { Enviroment } from '../enums/env';
export declare class Env {
    static get(): Enviroment;
    static IsProd(): boolean;
    static IsDev(): boolean;
    static IsTest(): boolean;
    static IsNotTest(): boolean;
    static IsNotProd(): boolean;
    static IsSandbox(): boolean;
    static useCache(): boolean;
    static readEnvVars(options: {
        envPath: string;
        fileName: string;
    }): any;
    static getEnvValue(options: {
        key: string;
        envPath: string;
        fileName: string;
    }): string;
    static setEnvValue(options: {
        key: string;
        value: string;
        envPath?: string;
        fileName?: string;
    }): void;
    static setEnv(options: {
        values: object;
        envPath?: string;
        fileName?: string;
    }): void;
}
