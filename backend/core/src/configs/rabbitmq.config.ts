import { registerAs } from '@nestjs/config'
import { config } from 'dotenv'
config()

export const RABBITMQ = {
	RABBIT_MQ_URI: process.env.RABBIT_MQ_URI,
}

export const rabbitMQConfig = registerAs('rabbitmq', () => RABBITMQ)
