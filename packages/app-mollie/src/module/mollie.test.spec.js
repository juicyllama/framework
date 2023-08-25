"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@juicyllama/utils");
const core_1 = require("@juicyllama/core");
const mollie_service_1 = require("./mollie.service");
const payment_entity_1 = require("./payment/payment.entity");
const payment_service_1 = require("./payment/payment.service");
const mollie_module_1 = require("./mollie.module");
const customer_entity_1 = require("./customer/customer.entity");
const E = customer_entity_1.MollieCustomer;
const MODULE = mollie_module_1.MollieModule;
const SERVICE = mollie_service_1.MollieService;
describe('MollieService', () => {
    const scaffolding = new core_1.Scaffold();
    let scaffold;
    let payments;
    let mandate;
    let paymentService;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        scaffold = yield scaffolding.up(MODULE, SERVICE);
        paymentService = scaffold.module.get(payment_service_1.PaymentService);
    }));
    describe('AddCard', () => {
        it('Should get a redirect link', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield scaffold.services.service.addCard(scaffold.values.account);
            expect(response).toBeDefined();
        }));
        it('Should be able to complete the process (redirect-back)', () => __awaiter(void 0, void 0, void 0, function* () {
            payments = yield paymentService.findAll();
            const payment = yield paymentService.syncPayment(payments[0]);
            expect(payment).toBeInstanceOf(payment_entity_1.MolliePayment);
            expect(payment.mollie_payment_id).toBeGreaterThan(0);
        }));
        it('Should be able to handle webhook', () => __awaiter(void 0, void 0, void 0, function* () {
            const payment = yield paymentService.syncPayment(payments[0]);
            expect(payment).toBeInstanceOf(payment_entity_1.MolliePayment);
            expect(payment.mollie_payment_id).toBeGreaterThan(0);
        }));
    });
    describe('ListCards', () => {
        it('Should return a list of mandates', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield scaffold.services.service.listCards(scaffold.values.account);
            expect(response).toBeDefined();
            expect(response[0]).toBeDefined();
            expect(response[0].mollie_mandate_id).toBeGreaterThan(0);
            mandate = response[0];
        }));
    });
    describe('Charge', () => {
        it('Should return a payment result', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield scaffold.services.service.charge(10.0, utils_1.SupportedCurrencies.USD, scaffold.values.account);
            expect(response).toBeDefined();
            expect(response.mollie_payment_id).toBeGreaterThan(0);
        }));
    });
    describe('Get Payment', () => {
        it('Should return a payment result', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield scaffold.services.service.getPayment(payments[0].mollie_payment_id);
            expect(response).toBeDefined();
            expect(response.mollie_payment_id).toBeGreaterThan(0);
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield scaffolding.down(E);
    }));
});
//# sourceMappingURL=mollie.test.spec.js.map