import { OpenAPIObject } from '@nestjs/swagger'
import { LogoOptions, TagGroupOptions } from './redocOptions.interface.js'

export interface RedocDocument extends Partial<OpenAPIObject> {
	info: OpenAPIObject['info'] & {
		'x-logo'?: LogoOptions
	}
	'x-tagGroups': TagGroupOptions[]
}
