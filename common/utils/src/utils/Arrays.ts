import { Logger } from './Logger'

const logger = new Logger()

export class Arrays {
	/**
	 * Replace the value of a key in an array of objects
	 *
	 * @param {any[]} array
	 * @param {object} mappers
	 * @return {any[]} array
	 */

	replaceObjectKeys(array: any[], mappers: object): any[] {
		try {
			if (!array || !mappers) {
				return array
			}

			return array.map((item: any) => {
				const newItem = {}
				Object.keys(item).forEach(key => {
					if (mappers[key]) {
						newItem[mappers[key]] = item[key]
						delete newItem[key]
					} else {
						newItem[key] = item[key]
					}
				})
				return newItem
			})
		} catch (e) {
			logger.error(`[@juicyllama/utils::Arrays::replaceObjectKeys] ${e.message}`, e)
		}
	}
}
