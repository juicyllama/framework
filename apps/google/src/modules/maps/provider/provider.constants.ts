import { Inject } from '@nestjs/common'

export const GoogleMapsClientToken = Symbol('INJECT:GOOGLE_MAPS:CLIENT')

export const InjectGoogleMaps = () => Inject(GoogleMapsClientToken)
