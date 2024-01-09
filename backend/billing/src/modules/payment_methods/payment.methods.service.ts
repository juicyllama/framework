import { BadRequestException, forwardRef, Inject, Injectable, NotImplementedException } from '@nestjs/common'
import { LazyModuleLoader } from '@nestjs/core'
import { Env, Logger, Modules, SupportedCurrencies, File, Strings } from '@juicyllama/utils'
import { Account, AccountService, AppIntegrationName, BaseService, BeaconService, Query } from '@juicyllama/core'
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
		@Inject(forwardRef(() => BeaconService)) private readonly beaconService: BeaconService,
		@Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
	) {
		super(query, repository)
	}

	//@ts-ignore
	async create(): Promise<void> {
		throw new BadRequestException(`Use createPaymentMethod instead.`)
	}

	async createPaymentMethod(options: {
		paymentMethod: DeepPartial<PaymentMethod>
		description?: string
	}): Promise<T> {
		const domain = 'billing::payment_methods::create'

		let paymentMethod = await super.create(options.paymentMethod)

		switch (options.paymentMethod.method) {
			case PaymentMethodType.creditcard:
				paymentMethod = await this.mollieAddCard(paymentMethod, options.description)

				if (Env.IsNotTest() && !paymentMethod.app_integration_name) {
					this.logger.error(
						`[${domain}] No payment method is enabled for this Mollie.`,
						options.paymentMethod,
					)
					throw new NotImplementedException(`No payment method is enabled for this Mollie.`)
				}

				return await super.update({
					...paymentMethod,
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

				return await super.update({
					...paymentMethod,
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
		return await super.update({
			payment_method_id: payment_method_id,
			status: status,
		})
	}

	async updateAppId(payment_method_id: number, app_payment_method_id: number): Promise<T> {
		return await super.update({
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

		return await super.remove(payment_method)
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
				await super.update({
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
				if (Modules.wise.isInstalled) {
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
		return await super.update(payment_method)
	}

	async disablePaymentMethod(payment_method: T): Promise<void> {
		payment_method.status = PaymentMethodStatus.disabled
		await super.update(payment_method)
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
		return Modules.wise.isInstalled
	}

	async mollieAddCard(payment_method: PaymentMethod, description?: string): Promise<PaymentMethod> {
		const domain = 'billing::PaymentMethodsService::mollieAddCard'

		this.logger.log(`[${domain}] Adding card`, {
			payment_method: payment_method,
			description: description,
		})

		if (Modules.mollie.isInstalled) {
			const { MollieModule, MollieService } = await Modules.mollie.load()
			try {
				const mollieModule = await this.lazyModuleLoader.load(() => MollieModule)
				const mollieService = mollieModule.get(MollieService)
				const mollieRedirect = await mollieService.addCard(<Account>payment_method.account, description)
				payment_method.app_integration_name = AppIntegrationName.mollie
				payment_method.redirect_url = mollieRedirect
				return payment_method
			} catch (e: any) {
				this.logger.error(`[${domain}] Failed to add card: ${e.message}`, e)
				return payment_method
			}
		} else {
			this.logger.error(`[${domain}] Mollie is not installed`)
		}

		return payment_method
	}

	async mollieChargeCard(payment_method: T, amount: number): Promise<void> {
		const domain = 'billing::PaymentMethodsService::mollieChargeCard'
		if (Modules.mollie.isInstalled) {
			const { MollieModule, MollieService } = await Modules.mollie.load()
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

	// async mollieRemoveCard(payment_method: T): Promise<void> {
	// 	const domain = 'billing::PaymentMethodsService::mollieAddCard'
	// 	if (Modules.isInstalled('@juicyllama/app-mollie')) {
	// 		//@ts-ignore
	// 		const { MollieModule, MollieService } = await import('@juicyllama/app-mollie')
	// 		try {
	// 			const mollieModule = await this.lazyModuleLoader.load(() => MollieModule)
	// 			const mollieService = mollieModule.get(MollieService)
	// 			await mollieService.deleteCard(payment_method.payment_method_id, payment_method.account)
	// 		} catch (e: any) {
	// 			this.logger.error(`[${domain}] Failed to add card: ${e.message}`)
	// 		}
	// 	}
	// }

	async syncPaymentDetails(payment_method: T): Promise<void> {
		const domain = 'billing::PaymentMethodsService::syncPaymentDetails'

		switch (payment_method.method) {
			case PaymentMethodType.creditcard:
				switch (payment_method.app_integration_name) {
					case AppIntegrationName.mollie:
						if (Modules.mollie.isInstalled) {
							const { MollieModule, MollieService } = await Modules.mollie.load()
							try {
								const mollieModule = await this.lazyModuleLoader.load(() => MollieModule)
								const mollieService = mollieModule.get(MollieService)
								const mandate = await mollieService.getMandate(payment_method.account)

								if (!mandate) {
									this.logger.error(`[${domain}] Failed to sync mandate`)
									return
								}

								await this.update({
									payment_method_id: payment_method.payment_method_id,
									details: {
										cardHolder: mandate.details.cardHolder,
										cardNumber: mandate.details.cardNumber,
										cardLabel: mandate.details.cardLabel,
										cardFingerprint: mandate.details.cardFingerprint,
										cardExpiryDate: mandate.details.cardExpiryDate,
									},
								})
							} catch (e: any) {
								this.logger.error(`[${domain}] Failed to sync mandate: ${e.message}`)
							}
						}
						break
				}
				break
		}
	}


	async sendBeaconOnExpiringSoon(
		payment_method: PaymentMethod,
	): Promise<void> {

		if (!process.env.BEACON_BILLING_PAYMENT_METHOD_EXPIRY) {
			return
		}

		if(!payment_method.account.finance_email){
			const user = await this.accountService.getOwner(payment_method.account.account_id)
			payment_method.account.finance_email = user.email
		}

		let markdown = ``

			if(File.exists(process.env.BEACON_BILLING_PAYMENT_METHOD_EXPIRY+'/email.md')){
				markdown = await File.read(process.env.BEACON_BILLING_PAYMENT_METHOD_EXPIRY+'/email.md')
				markdown = Strings.replacer(markdown, {
					payment_method: payment_method,
				})
			}else{
				markdown = `The payment method on file for ${payment_method.account.account_name} is expiring soon. Please update your payment method.`
			}


		await this.beaconService.notify({
			methods: {
				email: true
				//todo add to app notifications
			},
			communication: {
				email: {
					to: {
						name: payment_method.account.account_name,
						email: payment_method.account.finance_email,
					}
				}
			},
			subject: `⚠️ ${payment_method.method} is expiring soon`,
			markdown: markdown
		})
	}
}
