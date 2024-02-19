import { ImATeapotException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import Strategy from 'passport-headerapikey'

@Injectable()
export class CronStrategy extends PassportStrategy(Strategy, 'cron') {
	constructor(private readonly configService: ConfigService) {
		super({ header: 'CRON-API-KEY', prefix: '' }, true, async (apiKey: string, done: any) => {
			return this.validate(apiKey, done)
		})
	}

	public validate = (apiKey: string, done: (error: Error | null, data: any) => {}) => {
		if (!this.configService.get<string>('CRON_API_KEY')) {
			done(new ImATeapotException(`#CRON_API_KEY`), null)
		}

		if (this.configService.get<string>('CRON_API_KEY') === apiKey) {
			done(null, true)
		}

		done(new UnauthorizedException(`Keys don't match`), null)
	}
}
