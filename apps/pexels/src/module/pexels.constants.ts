import { Inject } from '@nestjs/common'

export const PexelsClientToken = Symbol('INJECT:PEXELS:CLIENT')

export const InjectPexels = () => Inject(PexelsClientToken)
