import { DeepPartial, Repository } from 'typeorm';
import { SupportedCurrencies, Logger } from '@juicyllama/utils';
import { MolliePayment } from './payment.entity';
import { ConfigService } from '@nestjs/config';
import { Payment } from '@mollie/api-client';
import { MandateService } from '../mandate/mandate.service';
import { CustomerService } from '../customer/customer.service';
import { Account, BaseService, Query } from '@juicyllama/core';
import { MollieMandate } from '../mandate/mandate.entity';
import { PaymentsService } from '@juicyllama/billing';
type T = MolliePayment;
export declare class PaymentService extends BaseService<T> {
    private readonly logger;
    readonly query: Query<T>;
    readonly repository: Repository<T>;
    private readonly configService;
    private readonly customerService;
    private readonly mandateService;
    private readonly paymentsService;
    constructor(logger: Logger, query: Query<T>, repository: Repository<T>, configService: ConfigService, customerService: CustomerService, mandateService: MandateService, paymentsService: PaymentsService);
    createFirstPayment(data: DeepPartial<T>, description?: string): Promise<string>;
    syncPayment(payment: MolliePayment): Promise<MolliePayment>;
    createPayment(amount: number, currency: SupportedCurrencies, account: Account, mandate?: MollieMandate): Promise<MolliePayment>;
    pushPaymentToBillingSystem(payment: MolliePayment): Promise<void>;
    linkMandate(payment: MolliePayment, mollie_response: Payment): Promise<MolliePayment>;
    remove(): Promise<T>;
}
export {};
