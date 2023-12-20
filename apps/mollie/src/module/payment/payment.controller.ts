import { Controller, Get, Post, Param, Res } from '@nestjs/common'
import { ApiHideProperty } from '@nestjs/swagger'
import { molliePaymentStatus } from '../mollie.mapper'
import { CustomerService } from '../customer/customer.service'
import { PaymentService } from './payment.service'

@Controller('app/mollie/payment')
export class PaymentController {
	constructor(
		private readonly paymentService: PaymentService,
		private readonly customerService: CustomerService,
	) {}

	/**
	 * The response back from the redirect
	 */

	@ApiHideProperty()
	@Get('redirect/:id')
	async addRedirect(@Param('id') id: number, @Res() res: any): Promise<void> {
		let payment = await this.paymentService.findById(id)
		payment = await this.paymentService.syncPayment(payment)
		const mollie_customer = await this.customerService.findById(payment.mollie_customer_id)
		res.redirect(
			`${process.env.BASE_URL_API}/billing/payment/methods/redirect/${mollie_customer.account_id}/${
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
