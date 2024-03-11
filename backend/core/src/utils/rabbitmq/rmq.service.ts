import { Injectable } from '@nestjs/common'
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices'

@Injectable()
export class RmqService {
	constructor() {}

	getOptions(options: { queue: string; noAck?: boolean; prefetchCount?: number }): RmqOptions {
		if (!options.queue) {
			throw new Error('queue is required')
		}

		if (!options.noAck) {
			options.noAck = false
		}

		const RABBIT_MQ_URI = process.env.RABBIT_MQ_URI
		if (!RABBIT_MQ_URI) {
			throw new Error('RABBIT_MQ_URI is required')
		}

		return {
			transport: Transport.RMQ,
			options: {
				urls: [RABBIT_MQ_URI],
				queue: process.env[`RABBIT_MQ_${options.queue}_QUEUE`],
				noAck: options.noAck,
				persistent: true,
				socketOptions: {
					heartbeatIntervalInSeconds: 30,
				},
				prefetchCount: options.prefetchCount,
			},
		}
	}

	ack(context: RmqContext) {
		const channel = context.getChannelRef()
		const originalMessage = context.getMessage()
		channel.ack(originalMessage)
	}
}
