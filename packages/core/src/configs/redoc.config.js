"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redocConfig = void 0;
const utils_1 = require("@juicyllama/utils");
exports.redocConfig = {
    title: `${utils_1.Strings.capitalize(process.env.PROJECT_NAME)} :: API`,
    logo: {
        url: process.env.BASE_URL_APP ? `${process.env.BASE_URL_APP}/icon.png` : undefined,
        backgroundColor: '#F0F0F0',
        altText: process.env.npm_package_name,
    },
    requiredPropsFirst: true,
    hideDownloadButton: false,
    hideHostname: false,
    tagGroups: [
        {
            name: 'Core resources',
            tags: ['Auth'],
        },
        {
            name: 'Accounts',
            tags: ['Account', 'Users'],
        },
    ],
};
//# sourceMappingURL=redoc.config.js.map