export declare class Stopwatch {
    private _start;
    private _end;
    private _domain;
    seconds: number;
    constructor(domain: string);
    start(): void;
    check(): number;
    stop(): number;
}
