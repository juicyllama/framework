import LANGUAGES from '../assets/languages.json'
import { isNil } from 'lodash'
import { Logger } from './Logger'
import { Language } from '../types/languages'

export class Languages {
	/**
	 * get a language by ISO2 code
	 * @param ISO2
	 */

	static getLanguage(ISO2: string): Language | undefined {
		if (!ISO2 || isNil(ISO2)) return

		try {
			return <Language>LANGUAGES.find(language => language.code === ISO2.toLowerCase())
		} catch (e: any) {
			const logger = new Logger()
			logger.error(`[Utils::Languages::getLanguage] ${e.message}`, e.stack)
			return
		}
	}
}
