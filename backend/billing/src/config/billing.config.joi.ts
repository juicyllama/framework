import Joi from 'joi'

export const billingConfigJoi = {
	BILLING_DEFAULT_PLAN: Joi.string().optional(),
	BILLING_MINIMUM_CHARGE: Joi.string().optional(),
	CRON_BILLING_INVOICES_GENERATE: Joi.string().optional(),
	CRON_BILLING_INVOICES_GENERATE_FREQUENCY: Joi.string().optional(),
	CRON_BILLING_INVOICES_RESEND: Joi.string().optional(),
	CRON_BILLING_INVOICES_RESEND_FREQUENCY: Joi.string().optional(),
	CRON_BILLING_INVOICES_SETTLE: Joi.string().optional(),
	CRON_BILLING_INVOICES_SETTLE_FREQUENCY: Joi.string().optional(),
	CRON_BILLING_SUBSCRIPTIONS_REBILL: Joi.string().optional(),
	CRON_BILLING_SUBSCRIPTIONS_REBILL_FREQUENCY: Joi.string().optional(),
	CRON_BILLING_WITHDRAWALS_SETTLE: Joi.string().optional(),
	CRON_BILLING_WITHDRAWALS_SETTLE_FREQUENCY: Joi.string().optional(),
	CRON_BILLING_WALLET_SETTLE_BALANCES: Joi.string().optional(),
	CRON_BILLING_WALLET_SETTLE_BALANCES_FREQUENCY: Joi.string().optional(),
}
