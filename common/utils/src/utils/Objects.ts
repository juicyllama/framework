export class Objects {
	/**
	 * Clean an object
	 */

	static clean(object: Object): Object {
		Object.keys(object).forEach((key) => {
			if (object[key] === undefined) {
				delete object[key]
			}

			if (object[key] === 'undefined') {
				delete object[key]
			}

			if (object[key] === '') {
				delete object[key]
			}
		})

		return object
	}

}
