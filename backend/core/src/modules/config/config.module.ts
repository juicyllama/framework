import { DynamicModule, Module, Type } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

import { getConfigToken } from './config.provider'

@Module({})
export class ConfigValidationModule {
	/**
	 * @param schema The Class DTO that represents the schema to validate for
	 * this specific feature
	 */
	static async register(schema: Type<object>): Promise<DynamicModule> {
		const token = getConfigToken(schema)
		return {
			module: ConfigValidationModule,
			providers: [
				{
					provide: token,
					useFactory: async () => {
						await ConfigModule.envVariablesLoaded
						const inst = plainToInstance(schema, process.env)
						const errors = await validate(inst)
						if (errors.length) {
							throw new Error(errors.map(e => e.toString()).join('\n'))
						}

						return inst
					},
				},
			],
			exports: [token],
		}
	}
}
