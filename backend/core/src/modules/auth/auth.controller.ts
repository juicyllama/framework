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
	DEFAULT_REFRESH_EXPIRY_DAYS,
	REFRESH_TOKEN_COOKIE_NAME,
} from './auth.constants'
import { AuthService } from './auth.service'
import { ValidateCodeDto } from './dtos/login.dto'
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
		type: SuccessResponseDto,
	})
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Req() req: AuthenticatedRequest, @Res({ passthrough: true }) res: Response) {
		const accessToken = await this.authService.login(req.user)
		const refreshToken = await this.authService.createRefreshToken(req.user)
		setAccessAndRefreshTokenCookies(res, accessToken, refreshToken)
		return { success: true }
	}

	@ApiOperation({
		summary: 'Refresh Token',
		description:
			'Posting with a refesh token cookie will return a new access token and set a cookie with the new refresh token',
	})
	@ApiOkResponse({
		description: 'OK',
		type: SuccessResponseDto,
	})
	@Post('refresh')
	async refresh(@Req() req: AuthenticatedRequest, @Res({ passthrough: true }) res: Response) {
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
		return { success: true }
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
		type: SuccessResponseDto,
	})
	@Post('password-reset/complete')
	async completePasswordReset(
		@Body() data: CompletePasswordResetDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<SuccessResponseDto> {
		const accessToken = await this.authService.completePasswordReset(data)
		setAccessAndRefreshTokenCookies(res, accessToken)
		return { success: true }
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
		type: SuccessResponseDto,
	})
	@Post('passwordless/code')
	async validateCodeAndLogin(
		@Body() data: ValidateCodeDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<SuccessResponseDto> {
		const accessToken = await this.authService.validateLoginCodeAndLogin(data)
		setAccessAndRefreshTokenCookies(res, accessToken)
		return { success: true }
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
		type: SuccessResponseDto,
	})
	@UseGuards(GoogleOauthGuard)
	@Get('google/redirect')
	async googleAuthRedirect(
		@Req() req: AuthenticatedRequest,
		@Res({ passthrough: true }) res: Response,
	): Promise<SuccessResponseDto> {
		const accessToken = await this.authService.login(req.user)
		setAccessAndRefreshTokenCookies(res, accessToken)
		return { success: true }
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
		type: SuccessResponseDto,
	})
	@UseGuards(LinkedinOauthGuard)
	@Get('linkedin/redirect')
	async linkedinAuthRedirect(
		@Req() req: AuthenticatedRequest,
		@Res({ passthrough: true }) res: Response,
	): Promise<SuccessResponseDto> {
		const accessToken = await this.authService.login(req.user)
		setAccessAndRefreshTokenCookies(res, accessToken)
		return { success: true }
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

function setAccessAndRefreshTokenCookies(res: Response, accessToken: string, refreshToken?: string) {
	/**
	 * Set the refresh token as a secure, httpOnly cookie that's only sent to this server's refresh endpoint
	 */
	function setTokenCookie(res: Response, name: string, value: string, expiryMinutes: number, path: string) {
		if (!process.env.BASE_URL_API) {
			throw new Error('BASE_URL_APP env variable not set')
		}
		res.cookie(name, value, {
			httpOnly: true, // don't allow JS to access the cookie
			secure: true, // only send the cookie over HTTPS
			domain: process.env.BASE_URL_API.replace('https://', '').replace('http://', ''), // only send the cookie to the API domain
			sameSite: 'none', // required for cross-site requests as the frontend may be on a different domain
			expires: new Date(Date.now() + expiryMinutes * 1000 * 60),
			path,
		})
	}
	setTokenCookie(
		res,
		ACCESS_TOKEN_COOKIE_NAME,
		accessToken,
		Number(process.env.JWT_ACCESS_TOKEN_EXPIRY_MINUTES || DEFAULT_ACCESS_TOKEN_EXPIRY_MINUTES),
		'/',
	)
	if (refreshToken) {
		setTokenCookie(
			res,
			REFRESH_TOKEN_COOKIE_NAME,
			refreshToken,
			Number(process.env.JWT_REFRESH_TOKEN_EXPIRY_DAYS || DEFAULT_REFRESH_EXPIRY_DAYS) * 24 * 60,
			'/auth/refresh', // only send the cookie to the refresh endpoint
		)
	}
}
