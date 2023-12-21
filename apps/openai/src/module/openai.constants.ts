import { Inject } from '@nestjs/common'

export const OpenAIClientToken = Symbol('INJECT:OPENAI:CLIENT')

export const InjectOpenAI = () => Inject(OpenAIClientToken)
