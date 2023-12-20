import { Inject } from '@nestjs/common'

export const AwsSesClientToken = Symbol('INJECT:AWS_SES:CLIENT')
export const InjectSes = () => Inject(AwsSesClientToken)
