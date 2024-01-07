import { forwardRef, ImATeapotException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import Strategy from 'passport-headerapikey'

@Injectable()
// @ts-ignore
export class CronStrategy extends PassportStrategy(Strategy, 'cron') {
	constructor(@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService) {
		super({ header: 'CRON-API-KEY', prefix: '' }, true, async (apiKey, done) => {
			return this.validate(apiKey, done)
		})
	}

	public validate = (apiKey: string, done: (error: Error, data) => {}) => {
		if (!this.configService.get<string>('CRON_API_KEY')) {
			done(new ImATeapotException(`#CRON_API_KEY`), null)
		}

		if (this.configService.get<string>('CRON_API_KEY') === apiKey) {
			done(null, true)
		}

		done(new UnauthorizedException(`Keys don't match`), null)
	}
}
