import Joi from 'joi';
export declare const beaconConfigJoi: {
    SYSTEM_EMAIL_ADDRESS: Joi.StringSchema<string>;
    SYSTEM_EMAIL_NAME: Joi.StringSchema<string>;
    PUSHER_APP_ID: Joi.StringSchema<string>;
    PUSHER_APP_KEY: Joi.StringSchema<string>;
    PUSHER_APP_SECRET: Joi.StringSchema<string>;
    PUSHER_APP_CLUSTER: Joi.StringSchema<string>;
    PUSHER_USE_TLS: Joi.BooleanSchema<boolean>;
    PUSHER_CHANNEL: Joi.StringSchema<string>;
};
