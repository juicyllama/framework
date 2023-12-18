import { DynamicModule, Module, Type } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import { getConfigToken } from './config.provider'

@Module({})
export class LlamaConfigModule {
	/**
	 * @param schema The Class DTO that represents the schema to validate for
	 * this specific feature
	 */
	static async register(schema: Type<object>): Promise<DynamicModule> {
		await ConfigModule.envVariablesLoaded
		const inst = plainToInstance(schema, process.env)
		const errors = validateSync(inst)
		if (errors.length) {
			throw new Error(errors.map(e => e.toString()).join('\n'))
		}
		const token = getConfigToken(schema)
		return {
			module: LlamaConfigModule,
			providers: [
				{
					provide: token,
					useValue: inst,
				},
			],
			exports: [token],
		}
	}
}
