import { Inject } from '@nestjs/common'

export const WordpressMediaUrlToken = Symbol('INJECT:WORDPRESS:MEDIA:URL')

export const InjectWordpressMediaUrl = () => Inject(WordpressMediaUrlToken)
