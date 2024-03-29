// Modules
import { OpenaiModule } from './module/openai.module'

//controllers

// Services
import { OpenaiService } from './module/openai.service'
//import { OpenaiSqlService } from './module/sql/openai.sql.service'

// Enums
//import { OpenAiConvertNLtoSQLTypes } from './module/openai.enums'

// DTOs
export { OpenaiModule, OpenaiService }

//Typing
import OpenAI from 'openai'
import { DeepPartial } from 'typeorm'
export type OpenAiOptions = DeepPartial<OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>
