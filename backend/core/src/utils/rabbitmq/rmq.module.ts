import { DynamicModule, Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { RmqService } from './rmq.service'

interface RmqModuleOptions {
	name: string
}

@Module({
	providers: [RmqService],
	exports: [RmqService],
})
export class RmqModule {
	static register({ name }: RmqModuleOptions): DynamicModule {
		return {
			module: RmqModule,
			imports: [
				ClientsModule.registerAsync([
					{
						name,
						useFactory: () => {
							const rabbitMqUri = process.env.RABBIT_MQ_URI
							if (!rabbitMqUri) {
								throw new Error('RABBIT_MQ_URI is not defined in the configuration.')
							}
							return {
								transport: Transport.RMQ,
								options: {
									urls: [rabbitMqUri], // Ensured it's not undefined
									queue: process.env[`RABBIT_MQ_${name}_QUEUE`],
								},
							}
						},
						inject: [],
					},
				]),
			],
			exports: [ClientsModule],
		}
	}
}
