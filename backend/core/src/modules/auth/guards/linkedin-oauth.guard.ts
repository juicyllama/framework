import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LinkedinOauthGuard extends AuthGuard('linkedin') {}
