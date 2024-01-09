import { DefaultNamingStrategy, Table, NamingStrategyInterface } from 'typeorm'

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
	foreignKeyName(tableOrName: Table | string, columns: string[]): string {
		return `fk_${this.build(tableOrName, columns)}`
	}

	primaryKeyName(tableOrName: Table | string, columns: string[]) {
		return `pk_${this.build(tableOrName, columns)}`
	}

	indexName(tableOrName: Table | string, columns: string[]): string {
		return `idx_${this.build(tableOrName, columns)}`
	}

	uniqueConstraintName(tableOrName: string | Table, columns: string[]): string {
		return `uq_${this.build(tableOrName, columns)}`
	}

	defaultConstraintName(tableOrName: string | Table, columnName: string): string {
		return `df_${tableOrName}_${columnName}`
	}

	build(tableOrName: string | Table, columns: string[]): string {
		tableOrName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name
		const name = columns.reduce((name, column) => `${name}_${column}`)
		return `${tableOrName}_${name}`
	}
}
