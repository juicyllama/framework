import { Inject } from '@nestjs/common'

export const SlackBoltClientToken = Symbol('INJECT:SLACK:CLIENT')

export const InjectSlack = () => Inject(SlackBoltClientToken)
