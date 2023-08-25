import { PaymentService } from './payment.service';
import { CustomerService } from '../customer/customer.service';
import { MandateService } from '../mandate/mandate.service';
export declare class PaymentController {
    private readonly paymentService;
    private readonly mandateService;
    private readonly customerService;
    constructor(paymentService: PaymentService, mandateService: MandateService, customerService: CustomerService);
    addRedirect(id: number, res: any): Promise<void>;
    paymentWebhook(id: number): Promise<void>;
}
