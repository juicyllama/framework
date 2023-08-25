"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_client_1 = require("@mollie/api-client");
function default_1() {
    return {
        resource: 'customer',
        id: 'cst_8wmqcHMN4U',
        mode: api_client_1.ApiMode.test,
        name: 'Customer A',
        email: 'customer@example.org',
        locale: null,
        metadata: null,
        createdAt: '2018-04-06T13:10:19.0Z',
        _links: {
            self: {
                href: 'https://api.mollie.com/v2/customers/cst_8wmqcHMN4U',
                type: 'application/hal+json',
            },
            dashboard: {
                href: 'https://www.mollie.com/dashboard/org_123456789/customers/cst_8wmqcHMN4U',
                type: 'text/html',
            },
            documentation: {
                href: 'https://docs.mollie.com/reference/v2/customers-api/create-customer',
                type: 'text/html',
            },
        },
    };
}
exports.default = default_1;
//# sourceMappingURL=customer.mock.js.map