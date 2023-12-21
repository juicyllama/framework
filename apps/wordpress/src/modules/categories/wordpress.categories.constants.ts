import { Inject } from '@nestjs/common'

export const WordpressCategoriesUrlToken = Symbol('INJECT:WORDPRESS:CATEGORIES:URL')

export const InjectWordpressCategoriesUrl = () => Inject(WordpressCategoriesUrlToken)
