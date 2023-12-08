import { TypeOrm } from './TypeOrm'
import { Logger } from '@juicyllama/utils'
import { Repository, ColumnType } from 'typeorm'

const logger = new Logger()

export class TypemOrmParquet {
	
	/**
	 * Generate a parquet schema from a TypeORM repository
	 */

	static schema<T>(repository: Repository<T>, skipColumns: string[]): any {

		const schema = {}

		const fields = TypeOrm.getColumnNames(repository)

		for (const field of fields) {

			if(skipColumns.includes(field)) continue

			schema[field] = {
				type: this.type(TypeOrm.getColumnType(repository, field)),
				optional: TypeOrm.isColumnNullable(repository, field)
			}
		}

		return schema

	}

	/**
	 * Convert a TypeORM column type to a parquet type
	 */

	static type(type: ColumnType): string {
	
		switch (type) {
			case 'int':
			case 'int8':
			case 'bigint':
				return 'INT64'
				
			case 'number':
			case 'int2':
			case 'int4':
			case 'smallint':
			case 'integer':
				return 'INT32'
		
			case 'decimal':
			case 'numeric':
			case 'money':
				return 'DOUBLE'

			case 'real':
			case 'float':
			case 'float4':
			case 'float8':
				return 'FLOAT'
	
			case 'varchar':
			case 'character':
			case 'char':
			case 'text':
			case 'time':
			case 'uuid':
			case 'string':
			case 'datetime':
			case 'timestamp':
			case 'date':
				return 'UTF8'
			
			case 'boolean':
			case 'bool':
				return 'BOOLEAN'
				
			case 'json':
			case 'jsonb':
				return 'JSON'
		
			default:

				if (typeof type === 'function') {
					switch (type.name) {
						case 'Number':
							return 'INT32'
						case 'String':
							return 'UTF8'
						default:
							logger.warn(`[@juicyllama/core::utils::TypeORM::Parquet::type] Unknown function type: ${type}` )
							return 'UTF8'
					}
				}

				logger.warn(`[@juicyllama/core::utils::TypeORM::Parquet::type] Unknown type: ${type}` )
				return 'UTF8'
		}



				

	}
	
}
