import { Inject } from '@nestjs/common'

export const MollieClientToken = Symbol('INJECT:MOLLIE:CLIENT')

export const InjectMollie = () => Inject(MollieClientToken)
