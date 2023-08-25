import Joi from 'joi';
export declare const systemConfigJoi: {
    SYSTEM_EMAIL_ADDRESS: Joi.StringSchema<string>;
    SYSTEM_EMAIL_NAME: Joi.StringSchema<string>;
    SYSTEM_DEFAULT_CURRENCY: Joi.StringSchema<string>;
};
