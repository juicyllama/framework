"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRelations = exports.AccountSelect = void 0;
var AccountSelect;
(function (AccountSelect) {
    AccountSelect["account_id"] = "account_id";
    AccountSelect["account_name"] = "account_name";
    AccountSelect["currency"] = "currency";
    AccountSelect["company_name"] = "company_name";
    AccountSelect["address_1"] = "address_1";
    AccountSelect["address_2"] = "address_2";
    AccountSelect["city"] = "city";
    AccountSelect["postcode"] = "postcode";
    AccountSelect["state"] = "state";
    AccountSelect["country"] = "country";
    AccountSelect["finance_email"] = "finance_email";
    AccountSelect["created_at"] = "created_at";
    AccountSelect["updated_at"] = "updated_at";
})(AccountSelect || (exports.AccountSelect = AccountSelect = {}));
var AccountRelations;
(function (AccountRelations) {
    AccountRelations["roles"] = "roles";
    AccountRelations["tags"] = "tags";
})(AccountRelations || (exports.AccountRelations = AccountRelations = {}));
//# sourceMappingURL=account.enums.js.map