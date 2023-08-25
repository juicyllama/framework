"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_client_1 = require("@mollie/api-client");
function default_1() {
    return {
        resource: 'mandate',
        id: 'mdt_h3gAaD5zP',
        mode: api_client_1.ApiMode.test,
        status: api_client_1.MandateStatus.valid,
        method: api_client_1.MandateMethod.creditcard,
        details: {
            cardHolder: 'John Doe',
            cardNumber: '4242',
            cardLabel: 'Visa',
            cardFingerprint: 'foo',
            cardExpiryDate: '2030-12-31',
        },
        mandateReference: 'YOUR-COMPANY-MD13804',
        signatureDate: '2018-05-07',
        createdAt: '2018-05-07T10:49:08+00:00',
        _links: {
            self: {
                href: 'https://api.mollie.com/v2/customers/cst_4qqhO89gsT/mandates/mdt_h3gAaD5zP',
                type: 'application/hal+json',
            },
            customer: {
                href: 'https://api.mollie.com/v2/customers/cst_4qqhO89gsT',
                type: 'application/hal+json',
            },
            documentation: {
                href: 'https://docs.mollie.com/reference/v2/mandates-api/create-mandate',
                type: 'text/html',
            },
        },
    };
}
exports.default = default_1;
//# sourceMappingURL=mandate.mock.js.map