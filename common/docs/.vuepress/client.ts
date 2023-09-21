import { defineClientConfig } from '@vuepress/client'
import {homeNavbar, homeTitle} from "../config";
import {quasarNavbar, quasarTitle} from "../frontend/quasar/config";
import {coreNavbar, coreTitle} from "../backend/core/config";
import {shortlinksNavbar, shortlinksTitle} from "../tools/shortlinks/config";
import {cliNavbar, cliTitle} from "../cli/config";
import {utilsNavbar, utilsTitle} from "../common/utils/config";
import {frontendTestNavbar, frontendTestTitle} from "../frontend/tests/config";
import {appsGoogleNavbar, appsGoogleTitle} from "../apps/google/config";
import {qrcodesTitle} from "../tools/qrcodes/config";
import {appsSlackNavbar, appsSlackTitle} from "../apps/slack/config";
import {appsWordpressNavbar, appsWordpressTitle} from "../apps/wordpress/config";
import {appStoreNavbar, appStoreTitle} from "../backend/app-store/config";
import {aiNavbar, aiTitle} from "../backend/ai/config";
import {appsOpenAiNavbar, appsOpenAiTitle} from "../apps/openai/config";
import {appsPexelsNavbar, appsPexelsTitle} from "../apps/pexels/config";

export default defineClientConfig({
	enhance({ app, router }) {
		router.afterEach((to) => {

			if (to.path.startsWith('/frontend/quasar')) {
				app.config.globalProperties.$site.title = quasarTitle
				app.config.globalProperties.$theme.navbar = quasarNavbar
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

			else if (to.path.startsWith('/tools/shortlinks')) {
				app.config.globalProperties.$site.title = shortlinksTitle
				app.config.globalProperties.$theme.navbar = shortlinksNavbar
			}

			else if (to.path.startsWith('/tools/qrcodes')) {
				app.config.globalProperties.$site.title = qrcodesTitle
				app.config.globalProperties.$theme.navbar = quasarNavbar
			}

			else if (to.path.startsWith('/cli')) {
				app.config.globalProperties.$site.title = cliTitle
				app.config.globalProperties.$theme.navbar = cliNavbar
			}

			else if (to.path.startsWith('/common/utils')) {
				app.config.globalProperties.$site.title = utilsTitle
				app.config.globalProperties.$theme.navbar = utilsNavbar
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