"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRelations = exports.UserOrderBy = exports.UserSelect = exports.UserAvatarType = exports.UserRoleNum = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["VIEWER"] = "VIEWER";
    UserRole["MEMBER"] = "MEMBER";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["OWNER"] = "OWNER";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserRoleNum;
(function (UserRoleNum) {
    UserRoleNum[UserRoleNum["VIEWER"] = 3] = "VIEWER";
    UserRoleNum[UserRoleNum["MEMBER"] = 5] = "MEMBER";
    UserRoleNum[UserRoleNum["ADMIN"] = 7] = "ADMIN";
    UserRoleNum[UserRoleNum["OWNER"] = 9] = "OWNER";
})(UserRoleNum || (exports.UserRoleNum = UserRoleNum = {}));
var UserAvatarType;
(function (UserAvatarType) {
    UserAvatarType["NONE"] = "NONE";
    UserAvatarType["CARTOON"] = "CARTOON";
    UserAvatarType["GRAVATAR"] = "GRAVATAR";
    UserAvatarType["IMAGE"] = "IMAGE";
})(UserAvatarType || (exports.UserAvatarType = UserAvatarType = {}));
var UserSelect;
(function (UserSelect) {
    UserSelect["user_id"] = "user_id";
    UserSelect["first_name"] = "first_name";
    UserSelect["last_name"] = "last_name";
    UserSelect["email"] = "email";
    UserSelect["created_at"] = "created_at";
    UserSelect["last_login"] = "last_login";
})(UserSelect || (exports.UserSelect = UserSelect = {}));
var UserOrderBy;
(function (UserOrderBy) {
    UserOrderBy["user_id"] = "user_id";
    UserOrderBy["first_name"] = "first_name";
    UserOrderBy["last_name"] = "last_name";
    UserOrderBy["email"] = "email";
    UserOrderBy["created_at"] = "created_at";
    UserOrderBy["last_login"] = "last_login";
})(UserOrderBy || (exports.UserOrderBy = UserOrderBy = {}));
var UserRelations;
(function (UserRelations) {
    UserRelations["roles"] = "roles";
    UserRelations["accounts"] = "accounts";
})(UserRelations || (exports.UserRelations = UserRelations = {}));
//# sourceMappingURL=users.enums.js.map