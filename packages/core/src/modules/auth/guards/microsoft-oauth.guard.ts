import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class MicrosoftOauthGuard extends AuthGuard('microsoft') {}
