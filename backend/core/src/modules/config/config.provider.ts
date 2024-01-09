import { Inject, Type } from '@nestjs/common'

export const getConfigToken = (schema: Type<unknown>): string => {
	return `CONFIG_TOKEN:${schema.name}`
}

export const InjectConfig = (schema: Type<unknown>) => Inject(getConfigToken(schema))
