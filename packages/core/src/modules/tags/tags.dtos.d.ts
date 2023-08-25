export declare class TagDto {
    name: string;
}
export declare class CreateTagDto extends TagDto {
}
declare const UpdateTagDto_base: import("@nestjs/common").Type<Partial<TagDto>>;
export declare class UpdateTagDto extends UpdateTagDto_base {
}
export {};
