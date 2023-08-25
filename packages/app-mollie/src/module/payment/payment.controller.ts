import { Controller, Get, Post, Inject, forwardRef, Param, Res } from '@nestjs/common'
import { ApiHideProperty } from '@nestjs/swagger'
import { PaymentService } from './payment.service'
import { molliePaymentStatus } from '../mollie.mapper'
import { CustomerService } from '../customer/customer.service'
import { MandateService } from '../mandate/mandate.service'

@Controller('app/mollie/payment')
export class PaymentController {
	constructor(
		@Inject(forwardRef(() => PaymentService)) private readonly paymentService: PaymentService,
		@Inject(forwardRef(() => MandateService)) private readonly mandateService: MandateService,
		@Inject(forwardRef(() => CustomerService)) private readonly customerService: CustomerService,
	) {}

	/**
	 * The response back from the redirect
	 */

	@ApiHideProperty()
	@Get('redirect/:id')
	async addRedirect(@Param('id') id: number, @Res() res: any): Promise<void> {
		const payment = await this.paymentService.findById(id)
		await this.paymentService.syncPayment(payment)
		const mollieCustomer = await this.customerService.findById(payment.customer.mollie_customer_id)
		res.redirect(
			`${process.env.BASE_URL_API}/billing/payment/methods/redirect/${mollieCustomer.account.account_id}/${
				payment.mandate.mollie_mandate_id
			}/${molliePaymentStatus(payment.status)}`,
		)
	}

	@ApiHideProperty()
	@Post('webhook/:id')
	async paymentWebhook(@Param('id') id: number): Promise<void> {
		const payment = await this.paymentService.findById(id)
		await this.paymentService.syncPayment(payment)
	}
}
