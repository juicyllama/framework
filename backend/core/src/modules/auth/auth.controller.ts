import { Logger, SuccessResponseDto } from '@juicyllama/utils'
import { Body, Controller, Get, Inject, Post, Req, Res, UseGuards, forwardRef } from '@nestjs/common'
import { ApiHideProperty, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { AccountId, UserAuth } from '../../decorators'
import { AuthenticatedRequest } from '../../types/authenticated-request.interface'
import { User } from '../users/users.entity'
import { UsersService } from '../users/users.service'
import {
	ACCESS_TOKEN_COOKIE_NAME,
	DEFAULT_ACCESS_TOKEN_EXPIRY_MINUTES,
	DEFAULT_REFRESH_TOKEN_EXPIRY_DAYS,
	REFRESH_TOKEN_COOKIE_NAME,
} from './auth.constants'
import { AuthService } from './auth.service'
import { LoginResponseDto, ValidateCodeDto } from './dtos/login.dto'
import { CompletePasswordResetDto, InitiateResetPasswordDto } from './dtos/password.reset.dto'
import { InitiatePasswordlessLoginDto } from './dtos/passwordless.login.dto'
import { GoogleOauthGuard } from './guards/google-oauth.guard'
import { LinkedinOauthGuard } from './guards/linkedin-oauth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
	) {}

	@ApiOperation({
		summary: 'Login',
		description: 'Posting the users email and password if successfully authenticated will create a token cookie.',
	})
	@ApiQuery({ name: 'email', required: true, type: String, example: 'jon.doe@example.com' })
	@ApiQuery({ name: 'password', required: true, type: String, example: 'S7r0#gP@$s' })
	@ApiOkResponse({
		description: 'OK',
		type: LoginResponseDto,
	})
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(
		@Req() req: AuthenticatedRequest,
		@Res({ passthrough: true }) res: Response,
	): Promise<LoginResponseDto> {
		const accessToken = await this.authService.login(req.user)
		const refreshToken = await this.authService.createRefreshToken(req.user)
		setAccessAndRefreshTokenCookies(res, accessToken, refreshToken)
		return new LoginResponseDto(accessToken)
	}

	@ApiOperation({
		summary: 'Refresh Token',
		description:
			'Posting with a refesh token cookie will return a new access token and set a cookie with the new refresh token',
	})
	@ApiOkResponse({
		description: 'OK',
		type: LoginResponseDto,
	})
	@Post('refresh')
	async refresh(
		@Req() req: AuthenticatedRequest,
		@Res({ passthrough: true }) res: Response,
	): Promise<LoginResponseDto> {
		const cookies = req.headers.cookie || ''
		const oldRefreshToken = cookies
			.split(';')
			.find(cookie => cookie.trim().startsWith(REFRESH_TOKEN_COOKIE_NAME + '='))
			?.split('=')[1]
		if (!oldRefreshToken) {
			throw new Error('No refresh token found')
		}
		const loginPayload = this.authService.decodeRefreshToken(oldRefreshToken)
		const newAccessToken = await this.authService.login(loginPayload)
		const newRefreshToken = await this.authService.createRefreshToken(loginPayload)
		setAccessAndRefreshTokenCookies(res, newAccessToken, newRefreshToken)
		this.logger.log('Refreshed token', {
			user_id: loginPayload.user_id,
			oldRefreshToken: '...' + oldRefreshToken.substring(-10),
		})
		return new LoginResponseDto(newAccessToken)
	}

	@ApiOperation({
		summary: 'Token To Cookie',
		description:
			'Posting with a Bearer Authorization token will set a cookie with the access token and a cookie with the refresh token',
	})
	@ApiOkResponse({
		description: 'OK',
		type: LoginResponseDto,
	})
	@Post('token-to-cookie')
	@UserAuth({ skipAccountId: true })
	async tokenToCookie(
		@Req() req: AuthenticatedRequest,
		@Res({ passthrough: true }) res: Response,
	): Promise<LoginResponseDto> {
		const user = await this.usersService.findById(req.user.user_id)
		const newAccessToken = await this.authService.login(user)
		const newRefreshToken = await this.authService.createRefreshToken(user)
		setAccessAndRefreshTokenCookies(res, newAccessToken, newRefreshToken)
		this.logger.log('Set new cookie token', {
			user_id: user.user_id,
		})
		return new LoginResponseDto(newAccessToken)
	}

	@ApiOperation({
		summary: 'Logout',
		description: 'Clears the access and refresh token cookies',
	})
	@ApiOkResponse({
		description: 'OK',
		type: SuccessResponseDto,
	})
	@Post('logout')
	@UserAuth({ skipAccountId: true })
	async logout(@Res({ passthrough: true }) res: Response): Promise<SuccessResponseDto> {
		res.clearCookie(ACCESS_TOKEN_COOKIE_NAME)
		res.clearCookie(REFRESH_TOKEN_COOKIE_NAME)
		return {
			success: true,
		}
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
	async completePasswordReset(
		@Body() data: CompletePasswordResetDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<LoginResponseDto> {
		const accessToken = await this.authService.completePasswordReset(data)
		setAccessAndRefreshTokenCookies(res, accessToken)
		return new LoginResponseDto(accessToken)
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
	async validateCodeAndLogin(
		@Body() data: ValidateCodeDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<LoginResponseDto> {
		const accessToken = await this.authService.validateLoginCodeAndLogin(data)
		setAccessAndRefreshTokenCookies(res, accessToken)
		return new LoginResponseDto(accessToken)
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
	async googleAuthRedirect(
		@Req() req: AuthenticatedRequest,
		@Res({ passthrough: true }) res: Response,
	): Promise<LoginResponseDto> {
		const accessToken = await this.authService.login(req.user)
		setAccessAndRefreshTokenCookies(res, accessToken)
		return new LoginResponseDto(accessToken)
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
	async linkedinAuthRedirect(
		@Req() req: AuthenticatedRequest,
		@Res({ passthrough: true }) res: Response,
	): Promise<LoginResponseDto> {
		const accessToken = await this.authService.login(req.user)
		setAccessAndRefreshTokenCookies(res, accessToken)
		return new LoginResponseDto(accessToken)
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

function setAccessAndRefreshTokenCookies(res: Response, accessToken: string, refreshToken?: string): void {
	if (!process.env.BASE_URL_API) {
		throw new Error('BASE_URL_APP env variable not set')
	}

	const domain: string = process.env.BASE_URL_API.replace(/^https?:\/\//, '') // Remove protocol

	// Set access token cookie
	res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
		httpOnly: true,
		secure: true, // Consider environment check for development vs. production
		domain,
		sameSite: 'none', // Adjust according to your requirements (Lax, Strict, None + Secure)
		expires: new Date(
			Date.now() +
				Number(process.env.JWT_ACCESS_TOKEN_EXPIRY_MINUTES || DEFAULT_ACCESS_TOKEN_EXPIRY_MINUTES) * 60000,
		), // Convert minutes to milliseconds
		path: '/',
	})

	// Set refresh token cookie, if refresh token is provided
	if (refreshToken) {
		res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
			httpOnly: true,
			secure: true, // Consider environment check for development vs. production
			domain,
			sameSite: 'none', // Adjust according to your requirements
			expires: new Date(
				Date.now() +
					Number(process.env.JWT_REFRESH_TOKEN_EXPIRY_DAYS || DEFAULT_REFRESH_TOKEN_EXPIRY_DAYS) * 86400000,
			), // Convert days to milliseconds
			path: '/auth/refresh',
		})
	}
}
