import { Inject } from '@nestjs/common'

export const AwsSnsClientToken = Symbol('INJECT:AWS_SNS:CLIENT')
export const InjectSns = () => Inject(AwsSnsClientToken)
