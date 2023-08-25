export declare enum UserRole {
    VIEWER = "VIEWER",
    MEMBER = "MEMBER",
    ADMIN = "ADMIN",
    OWNER = "OWNER"
}
export declare enum UserRoleNum {
    VIEWER = 3,
    MEMBER = 5,
    ADMIN = 7,
    OWNER = 9
}
export declare enum UserAvatarType {
    NONE = "NONE",
    CARTOON = "CARTOON",
    GRAVATAR = "GRAVATAR",
    IMAGE = "IMAGE"
}
export declare enum UserSelect {
    user_id = "user_id",
    first_name = "first_name",
    last_name = "last_name",
    email = "email",
    created_at = "created_at",
    last_login = "last_login"
}
export declare enum UserOrderBy {
    user_id = "user_id",
    first_name = "first_name",
    last_name = "last_name",
    email = "email",
    created_at = "created_at",
    last_login = "last_login"
}
export declare enum UserRelations {
    roles = "roles",
    accounts = "accounts"
}
