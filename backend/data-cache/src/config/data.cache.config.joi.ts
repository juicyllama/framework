import Joi from 'joi'

export const dataCacheConfigJoi = {
	JUICYLLAMA_DATA_CACHE_API_KEY: Joi.string().required(),
}
