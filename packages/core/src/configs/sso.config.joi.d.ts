import Joi from 'joi';
export declare const defaultSSOString = "TODO";
export declare const ssoConfigJoi: {
    FACEBOOK_APP_ID: Joi.StringSchema<string>;
    FACEBOOK_APP_SECRET: Joi.StringSchema<string>;
    GOOGLE_CLIENT_ID: Joi.StringSchema<string>;
    GOOGLE_CLIENT_SECRET: Joi.StringSchema<string>;
    AZURE_AD_CLIENT_ID: Joi.StringSchema<string>;
    AZURE_AD_TENANT_ID: Joi.StringSchema<string>;
};
