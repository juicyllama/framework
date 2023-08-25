import { BadRequestException, forwardRef, Inject, Injectable, NotImplementedException } from '@nestjs/common'
import { LazyModuleLoader } from '@nestjs/core'
import { Env, Logger, Modules, SupportedCurrencies } from '@juicyllama/utils'
import { Account, AppIntegrationName, BaseService, Query } from '@juicyllama/core'
import { DeepPartial, Repository } from 'typeorm'
import { PaymentMethod } from './payment.methods.entity'
import { PaymentMethodStatus, PaymentMethodType } from './payment.methods.enums'
import { InjectRepository } from '@nestjs/typeorm'
import {
	PaymentMethodBankTransferDetails,
	PaymentMethodBankTransferEURDetails,
	PaymentMethodBankTransferGBPDetails,
	PaymentMethodBankTransferUSDDetails,
} from './payment.methods.dtos'

const E = PaymentMethod
type T = PaymentMethod

@Injectable()
export class PaymentMethodsService extends BaseService<T> {
	constructor(
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => LazyModuleLoader)) private readonly lazyModuleLoader: LazyModuleLoader,

		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
	) {
		super(query, repository)
	}

	//@ts-ignore
	async create(): Promise<void> {
		throw new BadRequestException(`Use createPaymentMethod instead.`)
	}

	async createPaymemtMethod(options: {
		paymentMethod: DeepPartial<PaymentMethod>
		description?: string
	}): Promise<T> {
		const domain = 'billing::payment_methods::create'
		switch (options.paymentMethod.method) {
			case PaymentMethodType.creditcard:
				options.paymentMethod = await this.mollieAddCard(options.paymentMethod, options.description)

				if (Env.IsNotTest() && !options.paymentMethod.app_integration_name) {
					this.logger.error(
						`[${domain}] No payment method is enabled for this payment method.`,
						options.paymentMethod,
					)
					throw new NotImplementedException(`No payment method is enabled for this payment method.`)
				}

				return await this.query.create(this.repository, {
					...options.paymentMethod,
					can_charge: true,
					can_refund: true,
					can_send: false,
				})

			case PaymentMethodType.banktransfer:
				await this.validateBankMethod(options.paymentMethod)

				if (Env.IsNotTest()) {
					throw new NotImplementedException(`Bank transfer is not fully implemented yet.`)
				}

				/*if(!await this.bankInstalled()){
					this.logger.error(`[${domain}] Bank transfer is not enabled`, data)
					throw new InternalServerErrorException(`Bank transfer is not enabled`)
				}*/

				return await this.query.create(this.repository, {
					...options.paymentMethod,
					can_send: true,
					can_refund: true,
					can_charge: false,
				})

			default:
				throw new BadRequestException(
					`Invalid payment method, choices are: ${Object.values(PaymentMethodType).join(', ')}`,
				)
		}
	}

	async updateStatus(payment_method_id: number, status: PaymentMethodStatus): Promise<T> {
		return await this.query.update(this.repository, {
			payment_method_id: payment_method_id,
			status: status,
		})
	}

	async updateAppId(payment_method_id: number, app_payment_method_id: number): Promise<T> {
		return await this.query.update(this.repository, {
			payment_method_id: payment_method_id,
			app_payment_method_id: app_payment_method_id,
		})
	}

	async delete(payment_method: PaymentMethod): Promise<PaymentMethod> {
		switch (payment_method.method) {
			case PaymentMethodType.creditcard:
				//await this.mollieRemoveCard(payment_method)
				break
		}

		return await this.query.remove(this.repository, payment_method)
	}

	async charge(payment_method: T, amount: number): Promise<void> {
		if (!payment_method.can_charge) {
			throw new BadRequestException('This payment method cannot be charged')
		}

		switch (payment_method.method) {
			case PaymentMethodType.creditcard:
				await this.mollieChargeCard(payment_method, amount)
				const next_attempt_at = new Date()
				next_attempt_at.setDate(next_attempt_at.getDate() + 1)
				await this.query.update(this.repository, {
					payment_method_id: payment_method.payment_method_id,
					next_attempt_at: next_attempt_at,
					attempts: payment_method.attempts + 1,
				})
				break
		}
	}

	async remit(payment_method: PaymentMethod /*amount: number*/): Promise<boolean> {
		const domain = 'billing::PaymentMethodsService::remit'

		if (!payment_method.can_send) {
			throw new BadRequestException('This payment method cannot be used to send money')
		}

		switch (payment_method.method) {
			case PaymentMethodType.banktransfer:
				if (Modules.isInstalled('@juicyllama/app-wise')) {
					/*const { MollieModule, MollieService } = await import('@juicyllama/app-mollie')
					try {
						const mollieModule = await this.lazyModuleLoader.load(() => MollieModule)
						const mollieService = mollieModule.get(MollieService)
						await mollieService.addCard(<Account>payment_method.account)
						return true
					} catch (e: any) {
						this.logger.error(`[${domain}] Failed to add card: ${e.message}`)
					}*/
				} else {
					this.logger.warn(`[${domain}] Wise is not installed`)
					return false
				}
				break
			default:
				this.logger.error(`[${domain}] Switch case ${payment_method.method} needs integration`)
				return false
		}
	}

	//async refund() {}

	async successfulPayment(payment_method: T): Promise<T> {
		payment_method.next_attempt_at = new Date()
		payment_method.attempts = 1
		return await this.query.update(this.repository, payment_method)
	}

	async disablePaymentMethod(payment_method: T): Promise<void> {
		payment_method.status = PaymentMethodStatus.disabled
		await this.query.update(this.repository, payment_method)
	}

	async validateBankMethod(data: DeepPartial<T>): Promise<void> {
		const domain = 'billing::PaymentMethodsService::validateBankTransfer'

		data.details = <PaymentMethodBankTransferDetails>data.details

		switch (data.currency) {
			case SupportedCurrencies.EUR:
				const EURDetails = <PaymentMethodBankTransferEURDetails>data.details.account_details

				if (!EURDetails.iban) {
					throw new BadRequestException(`[${domain}] Missing IBAN`)
				}

				return

			case SupportedCurrencies.USD:
				const USDDetails = <PaymentMethodBankTransferUSDDetails>data.details.account_details

				if (!USDDetails.routing_number) {
					throw new BadRequestException(`[${domain}] Missing routing number`)
				}

				if (!USDDetails.account_number) {
					throw new BadRequestException(`[${domain}] Missing account number`)
				}

				return

			case SupportedCurrencies.GBP:
				const GBPDetails = <PaymentMethodBankTransferGBPDetails>data.details.account_details

				if (!GBPDetails.sort_code) {
					throw new BadRequestException(`[${domain}] Missing sort code`)
				}

				if (!GBPDetails.account_number) {
					throw new BadRequestException(`[${domain}] Missing account number`)
				}

				return
		}
	}

	async bankInstalled(): Promise<boolean> {
		return Modules.isInstalled('@juicyllama/app-wise')
	}

	async mollieAddCard(payment_method: DeepPartial<T>, description?: string): Promise<DeepPartial<T>> {
		const domain = 'billing::PaymentMethodsService::mollieAddCard'

		if (Modules.isInstalled('@juicyllama/app-mollie')) {
			//@ts-ignore
			const { MollieModule, MollieService } = await import('@juicyllama/app-mollie')
			try {
				const mollieModule = await this.lazyModuleLoader.load(() => MollieModule)
				const mollieService = mollieModule.get(MollieService)
				const mollieRedirect = await mollieService.addCard(<Account>payment_method.account, description)

				payment_method.app_integration_name = AppIntegrationName.mollie
				payment_method.redirect_url = mollieRedirect

				return payment_method
			} catch (e: any) {
				this.logger.error(`[${domain}] Failed to add card: ${e.message}`)
				return payment_method
			}
		}

		return payment_method
	}

	async mollieChargeCard(payment_method: T, amount: number): Promise<void> {
		const domain = 'billing::PaymentMethodsService::mollieChargeCard'
		if (Modules.isInstalled('@juicyllama/app-mollie')) {
			//@ts-ignore
			const { MollieModule, MollieService } = await import('@juicyllama/app-mollie')
			try {
				const mollieModule = await this.lazyModuleLoader.load(() => MollieModule)
				const mollieService = mollieModule.get(MollieService)
				await mollieService.charge(
					amount,
					payment_method.currency,
					payment_method.account,
					payment_method.app_payment_method_id,
				)
			} catch (e: any) {
				this.logger.error(`[${domain}] Failed to add card: ${e.message}`)
			}
		}
	}

	async mollieRemoveCard(payment_method: T): Promise<void> {
		const domain = 'billing::PaymentMethodsService::mollieAddCard'
		if (Modules.isInstalled('@juicyllama/app-mollie')) {
			//@ts-ignore
			const { MollieModule, MollieService } = await import('@juicyllama/app-mollie')
			try {
				const mollieModule = await this.lazyModuleLoader.load(() => MollieModule)
				const mollieService = mollieModule.get(MollieService)
				await mollieService.deleteCard(payment_method.payment_method_id, payment_method.account)
			} catch (e: any) {
				this.logger.error(`[${domain}] Failed to add card: ${e.message}`)
			}
		}
	}
}
