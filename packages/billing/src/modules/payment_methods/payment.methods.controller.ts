import {
	Body,
	CACHE_MANAGER,
	Controller,
	Delete,
	forwardRef,
	Get,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	Post,
	Query,
	Req,
	Res,
} from '@nestjs/common'
import { ApiHeader, ApiHideProperty, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Cache } from 'cache-manager'
import { AccountId, AccountService, AuthService, ReadManyDecorator, UserAuth, UserRole } from '@juicyllama/core'
import { CachePeriod, Logger, SupportedCurrencies } from '@juicyllama/utils'
import { PaymentMethodsService } from './payment.methods.service'
import { PaymentMethod } from './payment.methods.entity'
import {
	PaymentMethodOrderBy,
	PaymentMethodRelations,
	PaymentMethodSelect,
	PaymentMethodStatus,
} from './payment.methods.enums'
import { FindOptionsWhere, In } from 'typeorm'
import { Query as JLQuery } from '@juicyllama/core/dist/utils/typeorm/Query'
import { CreatePaymentMethodDto } from './payment.methods.dtos'
import { PaymentStatus } from '../payments/payments.enums'

const E = PaymentMethod
type T = PaymentMethod
const cache_key = 'redirect_url'

@ApiTags('Payment Methods')
@Controller('billing/payment/methods')
export class PaymentMethodsController {
	constructor(
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => PaymentMethodsService)) private readonly paymentMethodsService: PaymentMethodsService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
		@Inject(forwardRef(() => JLQuery)) private readonly query: JLQuery<T>,
	) {}

	/**
	 * This is a redirect endpoint for the payment gateway to redirect to after a payment has been made
	 */

	@ApiHideProperty()
	@Get('redirect/:account_id/:ext_payment_method_id/:payment_status')
	async addRedirect(
		@Req() req,
		@Res() res: any,
		@Param('account_id') account_id: number,
		@Param('ext_payment_method_id') ext_payment_method_id: number,
		@Param('payment_status') payment_status: PaymentStatus,
	): Promise<void> {
		const domain = 'billing::PaymentMethodsController::addRedirect'

		const payment_method = await this.paymentMethodsService.findOne({
			where: {
				account: {
					account_id: account_id,
				},
				status: PaymentMethodStatus.pending,
			},
			order: {
				created_at: 'DESC',
			},
		})

		if (!payment_method) {
			this.logger.error(`[${domain}] Payment method not found`, {
				account_id: account_id,
				ext_payment_method_id: ext_payment_method_id,
				payment_status: payment_status,
			})
		}

		if (payment_method) {
			await this.paymentMethodsService.updateAppId(payment_method.payment_method_id, ext_payment_method_id)

			switch (payment_status) {
				case PaymentStatus.success:
					await this.paymentMethodsService.updateStatus(
						payment_method.payment_method_id,
						PaymentMethodStatus.active,
					)
					break

				case PaymentStatus.declined:
					await this.paymentMethodsService.updateStatus(
						payment_method.payment_method_id,
						PaymentMethodStatus.disabled,
					)
					await this.paymentMethodsService.delete(payment_method)
					break
			}
		}

		const redirect_url = <string>await this.cacheManager.get(cache_key)
		if (redirect_url) {
			res.redirect(`${redirect_url}?status=${payment_status}`)
		} else {
			res.redirect(`${process.env.APP_BASE_URL}?status=${payment_status}`)
		}
	}

	@ApiOperation({
		summary: 'Add Payment Method',
	})
	@ApiHeader({
		name: 'account_id',
		description: 'The account you are acting for',
		required: true,
		example: 1,
	})
	@UserAuth()
	@Post()
	async create(
		@Req() req,
		@AccountId() account_id: number,
		@Body()
		data: {
			payment_method: CreatePaymentMethodDto
			description?: string
		},
	): Promise<T> {
		const domain = 'billing::PaymentMethodsController::create'

		await this.cacheManager.set(cache_key, data.payment_method.redirect_url, CachePeriod.DAY)

		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		const account = await this.accountService.findById(account_id)
		const payment_method = await this.paymentMethodsService.createPaymemtMethod({
			paymentMethod: {
				account: account,
				method: data.payment_method.method,
				currency: data.payment_method.currency,
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

	@ReadManyDecorator(E, PaymentMethodSelect, PaymentMethodOrderBy, PaymentMethodRelations)
	@ApiQuery({
		name: 'currency',
		description: 'The currency you are requesting data for',
		type: String,
		required: false,
		example: SupportedCurrencies.USD,
	})
	@UserAuth()
	async findAll(@Req() req, @Query() query, @AccountId() account_id: number): Promise<T[]> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])

		const where: FindOptionsWhere<T>[] = [
			{
				account: {
					account_id: In([account_id]),
				},
				currency: query.currency ?? null,
			},
		]

		return await this.paymentMethodsService.findAll(this.query.findOptions(query, where))
	}

	@ApiOperation({
		summary: 'Delete',
	})
	@ApiHeader({
		name: 'account_id',
		description: 'The account you are acting for',
		required: true,
		example: 1,
	})
	@ApiParam({
		name: 'payment_method_id',
		description: 'The id of the payment method you wish to delete',
		type: Number,
		required: true,
		example: 1,
	})
	@UserAuth()
	@Delete(':payment_method_id')
	async delete(
		@Req() req,
		@AccountId() account_id: number,
		@Param('payment_method_id') payment_method_id: number,
	): Promise<T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		const payment_method = await this.paymentMethodsService.findOne({
			where: {
				payment_method_id: payment_method_id,
				account: {
					account_id: account_id,
				},
			},
		})

		if (!payment_method) {
			throw new NotFoundException('Payment method not found')
		}

		return await this.paymentMethodsService.delete(payment_method)
	}
}
