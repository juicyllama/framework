"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguage = exports.getCountry = exports.getLocale = void 0;
const Logger_1 = require("./Logger");
function getLocale() {
    var _a, _b;
    const logger = new Logger_1.Logger();
    const nav = window.navigator;
    const browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'];
    let i, language, len, shortLanguage = null;
    if (Array.isArray(nav.languages)) {
        for (i = 0; i < nav.languages.length; i++) {
            language = nav.languages[i];
            len = language.length;
            if (!shortLanguage && len) {
                shortLanguage = language;
            }
            if (language && len > 2) {
                logger.verbose('[@juicyllama/utils::Locale::getLocale] Locale Detected ', language);
                return language;
            }
        }
    }
    for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
        language = nav[browserLanguagePropertyKeys[i]];
        if (language == null) {
            continue;
        }
        len = language.length;
        if (!shortLanguage && len) {
            shortLanguage = language;
        }
        if (language && len > 2) {
            logger.verbose('[@juicyllama/utils::Locale::getLocale] Locale Detected ', language);
            return language;
        }
    }
    if (shortLanguage) {
        logger.verbose('[@juicyllama/utils::Locale::getLocale] Locale Detected ', shortLanguage);
        return shortLanguage;
    }
    if ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.DEFAULT_LOCALE) {
        logger.verbose('[@juicyllama/utils::Locale::getLocale] Locale from DEFAULT_LOCALE ', process.env.DEFAULT_LOCALE);
        return process.env.DEFAULT_LOCALE;
    }
    if ((_b = process === null || process === void 0 ? void 0 : process.env) === null || _b === void 0 ? void 0 : _b.VITE_DEFAULT_LOCALE) {
        logger.verbose('[@juicyllama/utils::Locale::getLocale] Locale from VITE_DEFAULT_LOCALE ', process.env.VITE_DEFAULT_LOCALE);
        return process.env.VITE_DEFAULT_LOCALE;
    }
    logger.verbose('[@juicyllama/utils::Locale::getLocale] Locale not found ', process.env.VITE_DEFAULT_LOCALE);
    return 'en-US';
}
exports.getLocale = getLocale;
function getCountry() {
    return getLocale().split('-')[1];
}
exports.getCountry = getCountry;
function getLanguage() {
    return getLocale().split('-')[0];
}
exports.getLanguage = getLanguage;
