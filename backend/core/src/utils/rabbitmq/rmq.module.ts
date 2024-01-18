import { DynamicModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
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
						useFactory: (configService: ConfigService) => {
							const rabbitMqUri = configService.get<string>('RABBIT_MQ_URI')
							if (!rabbitMqUri) {
								throw new Error('RABBIT_MQ_URI is not defined in the configuration.')
							}
							return {
								transport: Transport.RMQ,
								options: {
									urls: [rabbitMqUri], // Ensured it's not undefined
									queue: configService.get<string>(`RABBIT_MQ_${name}_QUEUE`),
								},
							}
						},
						inject: [ConfigService],
					},
				]),
			],
			exports: [ClientsModule],
		}
	}
}
