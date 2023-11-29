import { Modules } from './Modules'

export class Markdown {
	/**
	 * Convert Markdown to HTML
	 *
	 * @param {string} markdown
	 * @returns {string}
	 */

	async markdownToHTML(markdown: string): Promise<string> {
		if (Modules.showdown.isInstalled) {
			const showdown = await Modules.showdown.load()
			const converter = new showdown.Converter()
			return converter.makeHtml(markdown)
		} else {
			throw new Error(`Markdown requires showdown to be installed`)
		}
	}
}
