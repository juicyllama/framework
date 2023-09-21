import { containerPlugin } from '@vuepress/plugin-container'
import {defaultTheme} from "@vuepress/theme-default";
import {homeNavbar} from "../config";

export default {
	 lang: 'en-US',
	 title: 'JuicyLlama Framework',
	 description: 'The framework documentation for JuicyLlama',
	 theme: defaultTheme({
	 	logo: 'https://juicyllama.com/assets/images/icon.png',
		navbar: homeNavbar,
	 }),
	plugins: [
	 	containerPlugin({ type: 'tip' }),
		containerPlugin({ type: 'warning' }),
	 	containerPlugin({ type: 'danger' }),
	 ],
}
