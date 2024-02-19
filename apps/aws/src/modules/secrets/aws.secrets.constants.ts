import { Inject } from '@nestjs/common'

export const AwsSecretsManagerToken = Symbol('TOKEN:AWS_SECRETS_MANAGER:CLIENT')
export const InjectSecretsManager = () => Inject(AwsSecretsManagerToken)
