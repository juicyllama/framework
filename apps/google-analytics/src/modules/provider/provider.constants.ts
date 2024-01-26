import { Inject } from '@nestjs/common'

export const GOOGLE_ANALYTICS_PROVIDER_TOKEN = 'TOKEN:GOOGLE_ANALYTICS_PROVIDER'

export const InjectGoogleAnalytics = () => Inject(GOOGLE_ANALYTICS_PROVIDER_TOKEN)
