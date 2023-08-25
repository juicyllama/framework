"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockUserRequest = exports.MockAccountRequest = void 0;
const faker_1 = require("@faker-js/faker");
function MockAccountRequest(password) {
    if (!password) {
        password = faker_1.faker.internet.password(20, false, /[!-~]/);
    }
    return {
        account_name: faker_1.faker.random.words(),
        owners_email: faker_1.faker.internet.email(),
        owners_password: password,
        owners_first_name: 'Owner',
        owners_last_name: 'User',
    };
}
exports.MockAccountRequest = MockAccountRequest;
function MockUserRequest(account) {
    const password = faker_1.faker.internet.password(20, false, /[!-~]/);
    return {
        accounts: [account],
        first_name: faker_1.faker.name.firstName(),
        last_name: faker_1.faker.name.lastName(),
        email: faker_1.faker.internet.email(),
        password: password,
        password_reset: false,
    };
}
exports.MockUserRequest = MockUserRequest;
//# sourceMappingURL=mocks.js.map