import { Inject } from '@nestjs/common'

export const WordpressUsersUrlToken = Symbol('INJECT:WORDPRESS:USERS:URL')

export const InjectWordpressUsersUrl = () => Inject(WordpressUsersUrlToken)
