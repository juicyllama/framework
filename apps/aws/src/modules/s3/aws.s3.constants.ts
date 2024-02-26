import { Inject } from '@nestjs/common'

export const S3Client = Symbol('TOKEN:AWS_S3:CLIENT')
export const InjectS3 = () => Inject(S3Client)
