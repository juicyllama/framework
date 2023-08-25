import { Account } from '@juicyllama/core';
import { CustomerService } from './customer/customer.service';
import { PaymentService } from './payment/payment.service';
import { MandateService } from './mandate/mandate.service';
import { SupportedCurrencies, Logger } from '@juicyllama/utils';
import { MollieMandate } from './mandate/mandate.entity';
import { MolliePayment } from './payment/payment.entity';
export declare class MollieService {
    private readonly customerService;
    private readonly mandateService;
    private readonly paymentService;
    private readonly logger;
    constructor(customerService: CustomerService, mandateService: MandateService, paymentService: PaymentService, logger: Logger);
    addCard(account: Account, description?: string): Promise<string>;
    listCards(account: Account): Promise<MollieMandate[]>;
    charge(amount: number, currency: SupportedCurrencies, account: Account, mollie_mandate_id?: number): Promise<MolliePayment>;
    getPayment(id: number): Promise<MolliePayment>;
}
