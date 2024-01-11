export class Enums {
	/**
	 * Get an enum key based on it's value
	 */

	static getKeyName<T extends object>(anEnum: T, value: any): string {
		return Object.keys(anEnum)[Object.values(anEnum).indexOf(value)]
	}

	//@ts-ignore
	static toArray<T>(Enum: T, key_name: string, pair_name: string): any[] {
		if (!Enum || !Object.keys(Enum).length) {
			return []
		}

		const arr: any[] = []
		Object.keys(Enum).forEach(key => {
			arr.push({
				[key_name]: key,
				[pair_name]: (Enum as any)[key],
			})
		})

		if (Object.keys(Enum)[0] === Object.values(Enum)[0]) {
			return arr
		}

		const half = Math.ceil(arr.length / 2)
		return arr.slice(half)
	}
}
