import { Inject } from '@nestjs/common'

export const WordpressPostsUrlToken = Symbol('INJECT:WORDPRESS:POSTS:URL')

export const InjectWordpressPostsUrl = () => Inject(WordpressPostsUrlToken)
