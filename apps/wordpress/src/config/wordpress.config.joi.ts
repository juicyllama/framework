import Joi from 'joi'

export const wordpressConfigJoi = {
	WORDPRESS_URL: Joi.string(),
	WORDPRESS_USERNAME: Joi.string(),
	WORDPRESS_APPLICATION_PASSWORD: Joi.string(),
}
