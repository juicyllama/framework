export declare class Setting {
    id: number;
    key: string;
    value: any;
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly deleted_at: Date;
    constructor(partial: Partial<Setting>);
}
