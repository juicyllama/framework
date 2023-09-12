import Joi from 'joi'

export const billingConfigJoi = {
	BILLING_DEFAULT_PLAN: Joi.string(),
	BILLING_MINIMUM_CHARGE: Joi.string(),
}
