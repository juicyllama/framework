"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.molliePaymentStatus = void 0;
const Mollie = __importStar(require("@mollie/api-client"));
const billing_1 = require("@juicyllama/billing");
function molliePaymentStatus(status) {
    switch (status) {
        case Mollie.PaymentStatus.pending:
        case Mollie.PaymentStatus.open:
        case Mollie.PaymentStatus.expired:
            return billing_1.PaymentStatus.pending;
        case Mollie.PaymentStatus.failed:
        case Mollie.PaymentStatus.canceled:
            return billing_1.PaymentStatus.declined;
        case Mollie.PaymentStatus.authorized:
        case Mollie.PaymentStatus.paid:
            return billing_1.PaymentStatus.success;
    }
}
exports.molliePaymentStatus = molliePaymentStatus;
//# sourceMappingURL=mollie.mapper.js.map