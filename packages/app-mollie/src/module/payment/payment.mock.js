"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_client_1 = require("@mollie/api-client");
function default_1(data) {
    return {
        resource: 'payment',
        id: 'tr_7UhSN1zuXS',
        mode: api_client_1.ApiMode.test,
        createdAt: '2018-03-20T09:13:37+00:00',
        amount: {
            value: data.amount.toString(),
            currency: data.currency,
        },
        metadata: {
            account_id: data.customer.account.account_id,
            customer_id: data.customer.mollie_customer_id,
        },
        method: api_client_1.PaymentMethod.creditcard,
        customerId: data.customer.ext_customer_id,
        sequenceType: api_client_1.SequenceType.first,
        status: api_client_1.PaymentStatus.open,
        isCancelable: false,
        expiresAt: '2018-03-20T09:28:37+00:00',
        details: null,
        profileId: 'pfl_QkEhN94Ba',
        cusotmerId: 'cst_8wmqcHMN4U',
        mandateId: 'mdt_h3gAaD5zP',
        redirectUrl: 'https://webshop.example.org/order/12345/',
        webhookUrl: 'https://webshop.example.org/payments/webhook/',
        _links: {
            self: {
                href: 'https://api.mollie.com/v2/payments/tr_7UhSN1zuXS',
                type: 'application/json',
            },
            checkout: {
                href: 'https://www.mollie.com/payscreen/select-method/7UhSN1zuXS',
                type: 'text/html',
            },
            dashboard: {
                href: 'https://www.mollie.com/dashboard/org_12345678/payments/tr_7UhSN1zuXS',
                type: 'application/json',
            },
            documentation: {
                href: 'https://docs.mollie.com/reference/v2/payments-api/create-payment',
                type: 'text/html',
            },
        },
    };
}
exports.default = default_1;
//# sourceMappingURL=payment.mock.js.map