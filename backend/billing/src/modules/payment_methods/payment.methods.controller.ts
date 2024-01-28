import {
	AccountId,
	AccountService,
	AuthService,
	crudDelete,
	ReadManyDecorator,
	UserAuth,
	UserRole,
	Query as TQuery,
	crudFindAll,
	DeleteDecorator,
	AuthenticatedRequest,
} from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import {
	Body,
	Controller,
	Get,
	Inject,
	InternalServerErrorException,
	Param,
	Post,
	Query,
	Req,
	Res,
} from '@nestjs/common'
import { ApiHideProperty, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PaymentStatus } from '../payments/payments.enums'
import {
	BILLING_PAYMENT_MENTHODS_NAME,
	BILLING_PAYMENT_MENTHODS_T,
	BILLING_PAYMENT_MENTHODS_E,
	BILLING_PAYMENT_MENTHODS_SEARCH_FIELDS,
	BILLING_PAYMENT_MENTHODS_PRIMARY_KEY,
	BILLING_PAYMENT_MENTHODS_DEFAULT_ORDER_BY,
} from './payment.methods.constants'
import { CreatePaymentMethodDto } from './payment.methods.dtos'
import {
	PaymentMethodOrderBy,
	PaymentMethodRelations,
	PaymentMethodSelect,
	PaymentMethodStatus,
} from './payment.methods.enums'
import { PaymentMethodsService } from './payment.methods.service'

@ApiTags('Payment Methods')
@Controller('billing/payment/methods')
export class PaymentMethodsController {
	constructor(
		private readonly logger: Logger,
		private readonly accountService: AccountService,
		private readonly authService: AuthService,
		private readonly service: PaymentMethodsService,
		@Inject(TQuery) private readonly tQuery: TQuery<BILLING_PAYMENT_MENTHODS_T>,
	) {}

	/**
	 * This is a redirect endpoint for the payment gateway to redirect to after a payment has been made
	 */

	@ApiHideProperty()
	@Get('redirect/:account_id/:ext_payment_method_id/:payment_status')
	async addRedirect(
		@Res() res: any,
		@Param('account_id') account_id: number,
		@Param('ext_payment_method_id') ext_payment_method_id: number,
		@Param('payment_status') payment_status: PaymentStatus,
	): Promise<void> {
		const domain = 'billing::PaymentMethodsController::addRedirect'

		let payment_method = await this.service.findOne({
			where: {
				account_id: account_id,
				app_payment_method_id: ext_payment_method_id,
			},
			order: {
				created_at: 'DESC',
			},
		})

		if (!payment_method) {
			payment_method = await this.service.findOne({
				where: {
					account_id: account_id,
					status: PaymentMethodStatus.pending,
				},
				order: {
					created_at: 'DESC',
				},
			})

			if (!payment_method) {
				this.logger.error(`[${domain}] Payment method not found`, {
					account_id: account_id,
					app_payment_method_id: ext_payment_method_id,
					payment_status: payment_status,
				})
			}
		}

		if (payment_method) {
			await this.service.updateAppId(payment_method.payment_method_id, ext_payment_method_id)

			switch (payment_status) {
				case PaymentStatus.success:
					await this.service.updateStatus(payment_method.payment_method_id, PaymentMethodStatus.active)
					break

				case PaymentStatus.declined:
					await this.service.updateStatus(payment_method.payment_method_id, PaymentMethodStatus.disabled)
					await this.service.delete(payment_method)
					break
			}
		}

		//Get payment detials from payment gateway
		if (!payment_method.details) {
			await this.service.syncPaymentDetails(payment_method)
		}

		res.redirect(payment_method.client_redirect_url)
	}

	@ApiOperation({
		summary: 'Add Payment Method',
	})
	@UserAuth()
	@Post()
	async create(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Body() data: CreatePaymentMethodDto,
	): Promise<BILLING_PAYMENT_MENTHODS_T> {
		const domain = 'billing::PaymentMethodsController::create'

		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])

		const account = await this.accountService.findById(account_id)

		const payment_method = await this.service.createPaymentMethod({
			paymentMethod: {
				account_id: account_id,
				account: account,
				method: data.payment_method.method,
				currency: data.payment_method.currency,
				client_redirect_url: data.payment_method.redirect_url,
			},
			description: data.description,
		})
		if (!payment_method) {
			const error = 'Failed to create payment method'
			this.logger.error(`[${domain}] ${error}`, {
				account_id: account_id,
				redirect_url: data.payment_method.redirect_url,
				req: req,
			})
			throw new InternalServerErrorException(error)
		}
		return payment_method
	}

	@ReadManyDecorator({
		name: BILLING_PAYMENT_MENTHODS_NAME,
		entity: BILLING_PAYMENT_MENTHODS_E,
		selectEnum: PaymentMethodSelect,
		orderByEnum: PaymentMethodOrderBy,
		relationsEnum: PaymentMethodRelations,
	})
	@UserAuth()
	async findAll(
		@Req() req: AuthenticatedRequest,
		@Query() query: any,
		@AccountId() account_id: number,
	): Promise<BILLING_PAYMENT_MENTHODS_T[]> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await crudFindAll<BILLING_PAYMENT_MENTHODS_T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			searchFields: BILLING_PAYMENT_MENTHODS_SEARCH_FIELDS,
			order_by: BILLING_PAYMENT_MENTHODS_DEFAULT_ORDER_BY,
		})
	}

	@DeleteDecorator({
		entity: BILLING_PAYMENT_MENTHODS_E,
		primaryKey: BILLING_PAYMENT_MENTHODS_PRIMARY_KEY,
		name: BILLING_PAYMENT_MENTHODS_NAME,
	})
	@UserAuth()
	async delete(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param() params: any,
	): Promise<BILLING_PAYMENT_MENTHODS_T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await crudDelete<BILLING_PAYMENT_MENTHODS_T>({
			service: this.service,
			primaryKey: params[BILLING_PAYMENT_MENTHODS_PRIMARY_KEY],
		})
	}
}
