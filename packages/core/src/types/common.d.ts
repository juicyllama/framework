export declare enum HTTP_METHODS {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}
export declare enum CRUD_ACTIONS {
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}
export declare enum METHOD {
    CREATE = "CREATE",
    GET = "GET",
    LIST = "LIST",
    COUNT = "COUNT",
    POST = "POST",
    PUT = "PUT",
    UPDATE = "UPDATE",
    UPLOAD = "UPLOAD",
    PATCH = "PATCH",
    DELETE = "DELETE",
    CHARTS = "CHARTS"
}
export interface PromiseLoopOutcomes<T> {
    total: number;
    success: number;
    failed: number;
    failures?: PromiseSettledResult<T>[];
}
export type CrudUploadCSVResponse = {
    affectedRows: number;
};
