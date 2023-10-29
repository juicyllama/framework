import { defineClientConfig } from '@vuepress/client'
import {homeNavbar, homeTitle} from "../config";
import {frontendCoreNavbar, frontendCoreTitle} from "../frontend/core/config";
import {coreNavbar, coreTitle} from "../backend/core/config";
import {shortlinksNavbar, shortlinksTitle} from "../tools/shortlinks/config";
import {cliNavbar, cliTitle} from "../common/cli/config";
import {utilsNavbar, utilsTitle} from "../common/utils/config";
import { nestJsRedocNavbar, nestJsRedocTitle } from '../common/nestjs-redoc/config'
import {frontendTestNavbar, frontendTestTitle} from "../frontend/tests/config";
import {appsGoogleNavbar, appsGoogleTitle} from "../apps/google/config";
import {appsSlackNavbar, appsSlackTitle} from "../apps/slack/config";
import {appsWordpressNavbar, appsWordpressTitle} from "../apps/wordpress/config";
import {appStoreNavbar, appStoreTitle} from "../backend/app-store/config";
import {aiNavbar, aiTitle} from "../backend/ai/config";
import {appsOpenAiNavbar, appsOpenAiTitle} from "../apps/openai/config";
import {appsPexelsNavbar, appsPexelsTitle} from "../apps/pexels/config";
import {ecommerceNavbar, ecommerceTitle} from "../backend/ecommerce/config";
import {websitesNavbar, websitesTitle} from "../backend/websites/config";
import {appsShopifyNavbar, appsShopifyTitle} from "../apps/shopify/config";
import { dataCacheTitle, dataCacheNavbar } from '../backend/data-cache/config'

export default defineClientConfig({
	enhance({ app, router }) {
		router.afterEach((to) => {

			if (to.path.startsWith('/frontend/core')) {
				app.config.globalProperties.$site.title = frontendCoreTitle
				app.config.globalProperties.$theme.navbar = frontendCoreNavbar
			}

			else if (to.path.startsWith('/frontend/tests')) {
				app.config.globalProperties.$site.title = frontendTestTitle
				app.config.globalProperties.$theme.navbar = frontendTestNavbar
			}

			else if (to.path.startsWith('/backend/core')) {
				app.config.globalProperties.$site.title = coreTitle
				app.config.globalProperties.$theme.navbar = coreNavbar
			}

			else if (to.path.startsWith('/backend/app-store')) {
				app.config.globalProperties.$site.title = appStoreTitle
				app.config.globalProperties.$theme.navbar = appStoreNavbar
			}

			else if (to.path.startsWith('/backend/ai')) {
				app.config.globalProperties.$site.title = aiTitle
				app.config.globalProperties.$theme.navbar = aiNavbar
			}

			else if (to.path.startsWith('/backend/data-cache')) {
				app.config.globalProperties.$site.title = dataCacheTitle
				app.config.globalProperties.$theme.navbar = dataCacheNavbar
			}

			else if (to.path.startsWith('/backend/ecommerce')) {
				app.config.globalProperties.$site.title = ecommerceTitle
				app.config.globalProperties.$theme.navbar = ecommerceNavbar
			}

			else if (to.path.startsWith('/backend/websites')) {
				app.config.globalProperties.$site.title = websitesTitle
				app.config.globalProperties.$theme.navbar = websitesNavbar
			}

			else if (to.path.startsWith('/tools/shortlinks')) {
				app.config.globalProperties.$site.title = shortlinksTitle
				app.config.globalProperties.$theme.navbar = shortlinksNavbar
			}

			else if (to.path.startsWith('/cli')) {
				app.config.globalProperties.$site.title = cliTitle
				app.config.globalProperties.$theme.navbar = cliNavbar
			}

			else if (to.path.startsWith('/common/utils')) {
				app.config.globalProperties.$site.title = utilsTitle
				app.config.globalProperties.$theme.navbar = utilsNavbar
			}

			else if (to.path.startsWith('/common/nestjs-redoc')) {
				app.config.globalProperties.$site.title = nestJsRedocTitle
				app.config.globalProperties.$theme.navbar = nestJsRedocNavbar
			}

			else if (to.path.startsWith('/apps/google')) {
				app.config.globalProperties.$site.title = appsGoogleTitle
				app.config.globalProperties.$theme.navbar = appsGoogleNavbar
			}

			else if (to.path.startsWith('/apps/openai')) {
				app.config.globalProperties.$site.title = appsOpenAiTitle
				app.config.globalProperties.$theme.navbar = appsOpenAiNavbar
			}

			else if (to.path.startsWith('/apps/pexels')) {
				app.config.globalProperties.$site.title = appsPexelsTitle
				app.config.globalProperties.$theme.navbar = appsPexelsNavbar
			}

			else if (to.path.startsWith('/apps/shopify')) {
				app.config.globalProperties.$site.title = appsShopifyTitle
				app.config.globalProperties.$theme.navbar = appsShopifyNavbar
			}


			else if (to.path.startsWith('/apps/slack')) {
				app.config.globalProperties.$site.title = appsSlackTitle
				app.config.globalProperties.$theme.navbar = appsSlackNavbar
			}

			else if (to.path.startsWith('/apps/wordpress')) {
				app.config.globalProperties.$site.title = appsWordpressTitle
				app.config.globalProperties.$theme.navbar = appsWordpressNavbar
			}

			else {
				app.config.globalProperties.$site.title = homeTitle
				app.config.globalProperties.$theme.navbar = homeNavbar
			}

		})
	}
})