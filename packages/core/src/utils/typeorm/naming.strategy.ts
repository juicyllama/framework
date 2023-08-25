import { DefaultNamingStrategy, Table, NamingStrategyInterface } from 'typeorm'
import crypto from 'crypto'

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
	foreignKeyName(tableOrName: Table | string, columnNames: string[], referencedTablePath?: string): string {
		tableOrName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name

		const name = columnNames.reduce(
			(name, column) => `${name}_${column}_${tableOrName}`,
			`${tableOrName}_${referencedTablePath}`,
		)

		return `fk_${crypto.createHash('md5').update(name).digest('hex')}`
	}

	primaryKeyName(tableOrName: Table | string, columnNames: string[], referencedTablePath?: string) {
		tableOrName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name

		const name = columnNames.reduce(
			(name, column) => `${name}_${column}_${tableOrName}`,
			`${tableOrName}_${referencedTablePath}`,
		)

		return `pk_${crypto.createHash('md5').update(name).digest('hex')}`
	}
}
