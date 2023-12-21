import { Inject } from '@nestjs/common'

export const WiseUrlToken = Symbol('INJECT:WISE:URL')

export const InjectWiseUrl = () => Inject(WiseUrlToken)
