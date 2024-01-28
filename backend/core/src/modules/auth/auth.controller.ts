import { SuccessResponseDto } from '@juicyllama/utils'
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { ApiHideProperty, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { AccountId, UserAuth } from '../../decorators'
import { AuthenticatedRequest } from '../../types/authenticated-request.interface'
import { User } from '../users/users.entity'
import { UsersService } from '../users/users.service'
import { AuthService } from './auth.service'
import { LoginResponseDto, ValidateCodeDto } from './dtos/login.dto'
import { CompletePasswordResetDto, InitiateResetPasswordDto } from './dtos/password.reset.dto'
import { InitiatePasswordlessLoginDto } from './dtos/passwordless.login.dto'
import { LinkedinOauthGuard } from './guards/linkedin-oauth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { GoogleOauthGuard } from './guards/google-oauth.guard'

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) {}

	@ApiOperation({
		summary: 'Login',
		description:
			'Posting the users email and password if successfully authenticated will return a token. Pass this bearer token in the `Authorization header (Authorization: Bearer {TOKEN})` to access restricted endpoints.',
	})
	@ApiQuery({ name: 'email', required: true, type: String, example: 'jon.doe@example.com' })
	@ApiQuery({ name: 'password', required: true, type: String, example: 'S7r0#gP@$s' })
	@ApiOkResponse({
		description: 'OK',
		type: LoginResponseDto,
	})
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Req() req: AuthenticatedRequest): Promise<LoginResponseDto> {
		return this.authService.login(req.user)
	}

	@UserAuth({ skipAccountId: true })
	@ApiOperation({
		summary: 'Profile',
		description: 'Test your bearer token here to confirm its all working ok.',
	})
	@ApiOkResponse({
		description: 'OK',
		type: User,
	})
	@Get('profile')
	async getProfile(@Req() req: AuthenticatedRequest): Promise<User> {
		return await this.usersService.validateEmail(req.user.email)
	}

	@ApiOperation({
		summary: 'Password Reset - Start',
		description: "Pass the user's email address to initiate the password reset process",
	})
	@ApiOkResponse({
		description: 'OK',
		type: SuccessResponseDto,
	})
	@Post('password-reset')
	async initiatePasswordReset(@Body() data: InitiateResetPasswordDto): Promise<SuccessResponseDto> {
		return {
			success: await this.authService.initiatePasswordReset(data),
		}
	}

	@ApiOperation({
		summary: 'Password Reset - Code',
		description: "Optional - This endpoint takes the code sent to the user's email as the input and validates it",
	})
	@ApiOkResponse({
		description: 'OK',
		type: User,
	})
	@Post('password-reset/code')
	async validateVerificationCode(@Body() data: ValidateCodeDto): Promise<SuccessResponseDto> {
		return this.authService.validateVerificationCode(data)
	}

	@ApiOperation({
		summary: 'Password Reset - Complete',
		description: 'Updates user password and returns the access_token once reset',
	})
	@ApiOkResponse({
		description: 'OK',
		type: LoginResponseDto,
	})
	@Post('password-reset/complete')
	async completePasswordReset(@Body() data: CompletePasswordResetDto): Promise<LoginResponseDto> {
		return this.authService.completePasswordReset(data)
	}

	@ApiOperation({
		summary: 'Passwordless - Start',
		description: "Pass the user's email address to initiate the passwordless login process",
	})
	@ApiOkResponse({
		description: 'OK',
		type: SuccessResponseDto,
	})
	@Post('passwordless')
	async initiatePasswordLessLogin(
		@Req() req: AuthenticatedRequest,
		@Body() data: InitiatePasswordlessLoginDto,
	): Promise<SuccessResponseDto> {
		return {
			success: await this.authService.initiatePasswordlessLogin(data),
		}
	}

	@ApiOperation({
		summary: 'Passwordless - Code',
		description:
			"This endpoint takes the code sent to the user's email as the input, validates it and  if successful, the user is authenticated and a token is returned",
	})
	@ApiOkResponse({
		description: 'OK',
		type: LoginResponseDto,
	})
	@Post('passwordless/code')
	async validateCodeAndLogin(@Body() data: ValidateCodeDto): Promise<LoginResponseDto> {
		return this.authService.validateLoginCodeAndLogin(data)
	}

	//todo test this

	@ApiOperation({
		summary: 'Google Login - Start',
	})
	@UseGuards(GoogleOauthGuard)
	@Get('google')
	async initiateGoogleLogin(): Promise<void> {
		// initiates the Google login
	}

	@ApiOperation({
		summary: 'Google Login - Complete',
	})
	@ApiOkResponse({
		description: 'OK',
		type: LoginResponseDto,
	})
	@UseGuards(GoogleOauthGuard)
	@Get('google/redirect')
	async googleAuthRedirect(@Req() req: AuthenticatedRequest): Promise<LoginResponseDto> {
		return this.authService.login(req.user)
	}

	@ApiOperation({
		summary: 'Linkedin Login - Start',
	})
	@UseGuards(LinkedinOauthGuard)
	@Get('linkedin')
	async initiateLinkedinLogin(): Promise<void> {
		// initiates the Linkedin login
	}

	@ApiOperation({
		summary: 'Linkedin Login - Complete',
	})
	@ApiOkResponse({
		description: 'OK',
		type: LoginResponseDto,
	})
	@UseGuards(LinkedinOauthGuard)
	@Get('linkedin/redirect')
	async linkedinAuthRedirect(@Req() req: AuthenticatedRequest): Promise<LoginResponseDto> {
		return this.authService.login(req.user)
	}

	@ApiHideProperty()
	@UserAuth()
	@Get('account/check')
	async accountCheck(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
	): Promise<{
		passed: boolean
	}> {
		const user = await this.usersService.findById(req.user.user_id)
		const account_ids = await this.authService.getAccountIds(user)
		return {
			passed: account_ids.includes(account_id),
		}
	}
}
