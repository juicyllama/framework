import Joi from 'joi';
export declare const joiConfigJoi: {
    NODE_ENV: Joi.StringSchema<string>;
    TZ: Joi.StringSchema<string>;
    REDIS_HOST: Joi.StringSchema<string>;
    REDIS_PORT: Joi.NumberSchema<number>;
    REDIS_PASSWORD: Joi.StringSchema<string>;
    MYSQL_HOSTNAME: Joi.StringSchema<string>;
    MYSQL_PORT: Joi.NumberSchema<number>;
    MYSQL_USERNAME: Joi.StringSchema<string>;
    MYSQL_PASSWORD: Joi.StringSchema<string>;
    MYSQL_DB_NAME: Joi.StringSchema<string>;
    MONGODB_HOSTNAME: Joi.StringSchema<string>;
    MONGODB_PORT: Joi.NumberSchema<number>;
    MONGODB_DATABASE: Joi.StringSchema<string>;
};
