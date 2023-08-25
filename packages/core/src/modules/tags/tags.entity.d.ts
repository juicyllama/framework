export declare class Tag {
    readonly tag_id: number;
    readonly name: string;
    readonly created_at: Date;
    deleted_at: Date;
    constructor(partial: Partial<Tag>);
}
