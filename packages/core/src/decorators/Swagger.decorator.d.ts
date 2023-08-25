export declare enum SwaggerPropertyType {
    STRING = 0,
    NUMBER = 1,
    BOOLEAN = 2,
    DATE = 3,
    ARRAY = 4,
    OBJECT = 5,
    ENUM = 6,
    EMAIL = 7
}
export declare enum SwaggerPropertyReference {
    ACCOUNT = "ACCOUNT",
    ACCOUNTS = "ACCOUNTS",
    CONTACTS = "CONTACTS",
    USER = "USER",
    USERS = "USERS"
}
export declare function SwaggerPropertyDecorator(options: {
    ref?: SwaggerPropertyReference;
    type?: SwaggerPropertyType;
    required?: boolean;
    hidden?: boolean;
    description?: string;
    example?: string | number | boolean | Date | object;
    enum?: any;
}): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
