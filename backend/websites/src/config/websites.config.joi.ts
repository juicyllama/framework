import Joi from 'joi'

export const billingConfigJoi = {
	CRON_WEBSITES_WEBSITE_SCREENSHOT_GENERATE: Joi.string().optional(),
	CRON_WEBSITES_WEBSITE_SCREENSHOT_GENERATE_FREQUENCY: Joi.string().optional(),
	CRON_WEBSITES_WEBSITE_ICON_GENERATE: Joi.string().optional(),
	CRON_WEBSITES_WEBSITE_ICON_GENERATE_FREQUENCY: Joi.string().optional(),
}
