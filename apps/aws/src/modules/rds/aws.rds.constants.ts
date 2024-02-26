import { Inject } from '@nestjs/common'

export const RdsClient = Symbol('TOKEN:AWS_RDS:CLIENT')
export const InjectRds = () => Inject(RdsClient)
