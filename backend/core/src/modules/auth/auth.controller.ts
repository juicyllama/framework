import { Body, Controller, forwardRef, Get, Inject, Post, Req, UseGuards } from '@nestjs/common'
import { ApiHideProperty, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { LoginResponseDto, ValidateCodeDto } from './dtos/login.dto'
import { CompletePasswordResetDto, InitiateResetPasswordDto } from './dtos/password.reset.dto'
import { User } from '../users/users.entity'
import { InitiatePasswordlessLoginDto } from './dtos/passwordless.login.dto'
import { UserAuth } from '../../decorators'
import { AuthService } from './auth.service'
import { SuccessResponseDto } from '@juicyllama/utils'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { UsersService } from '../users/users.service'
import { AuthGuard } from '@nestjs/passport'
import { AccountId } from '../../decorators'
import { AzureADGuard } from './strategies/azure.strategy'

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
	) {}

	@ApiOperation({
		summary: 'Login',
		description:
			'Posting the users email and password if successfully authenticated will return a token. Pass this bearer token in the `Authorization header (Authorization: Bearer {TOKEN})` to access restricted endpoints.',
	})
	@ApiQuery({ name: 'email', required: true, type: String, example: 'richard.branson@fly.virgin.com' })
	@ApiQuery({ name: 'password', required: true, type: String, example: 'S7r0#gP@$s' })
	@ApiOkResponse({
		description: 'OK',
		type: LoginResponseDto,
	})
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Req() req): Promise<LoginResponseDto> {
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
	async getProfile(@Req() req): Promise<User> {
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
	async initiatePasswordReset(@Req() req, @Body() data: InitiateResetPasswordDto): Promise<SuccessResponseDto> {
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
		@Req() req,
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
	@UseGuards(AuthGuard('google'))
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
	@UseGuards(AuthGuard('google'))
	@Get('google/redirect')
	async googleAuthRedirect(@Req() req): Promise<LoginResponseDto> {
		return this.authService.login(req.user)
	}

	@ApiOperation({
		summary: 'Azure AD Login - Start',
	})
	@UseGuards(AzureADGuard)
	@Get('azure_ad')
	async initiateAzureLogin(): Promise<void> {
		// initiates the Azure AD login
	}

	@ApiOperation({
		summary: 'Azure AD Login - Complete',
	})
	@ApiOkResponse({
		description: 'OK',
		type: LoginResponseDto,
	})
	@UseGuards(AzureADGuard)
	@Get('azure_ad/redirect')
	async azureAuthRedirect(@Req() req): Promise<LoginResponseDto> {
		return this.authService.login(req.user)
	}

	@ApiHideProperty()
	@UserAuth()
	@Get('account/check')
	async accountCheck(
		@Req() req,
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
